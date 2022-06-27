import React, { ReactElement, useCallback, useContext, useEffect, useState } from 'react'
import LanguageContext from '../../contexts/language'
import i18n from '../../utils/i18n'
import { SellViewProps } from './Sell'
import { saveOffer } from '../../utils/offer'
import { MessageContext } from '../../contexts/message'
import createEscrowEffect from './effects/createEscrowEffect'
import checkFundingStatusEffect from '../../effects/checkFundingStatusEffect'
import FundingView from './components/FundingView'
import NoEscrowFound from './components/NoEscrowFound'
import { Loading, SatsFormat, Text, Title } from '../../components'
import { info } from '../../utils/log'
import postOfferEffect from '../../effects/postOfferEffect'
import { View } from 'react-native'
import tw from '../../styles/tailwind'
import Refund from '../../overlays/Refund'
import { OverlayContext } from '../../contexts/overlay'
import { useFocusEffect } from '@react-navigation/native'
import { getTradingLimit } from '../../utils/peachAPI'
import { updateTradingLimit } from '../../utils/account'
import Escrow from '../../overlays/info/Escrow'

// eslint-disable-next-line max-lines-per-function
export default ({ offer, updateOffer, setStepValid, next, back, navigation }: SellViewProps): ReactElement => {
  useContext(LanguageContext)
  const [, updateOverlay] = useContext(OverlayContext)
  const [, updateMessage] = useContext(MessageContext)
  const [updatePending, setUpdatePending] = useState(true)
  const [escrow, setEscrow] = useState(offer.escrow || '')
  const [fundingError, setFundingError] = useState<FundingError>('')
  const [fundingStatus, setFundingStatus] = useState<FundingStatus>(offer.funding)
  const fundingAmount = Math.round(offer.amount)

  const saveAndUpdate = (offerData: SellOffer, shield = true) => {
    updateOffer(offerData)
    saveOffer(offerData, undefined, shield)
  }
  const navigate = () => navigation.replace('offers', {})

  useFocusEffect(useCallback(!offer.id ? postOfferEffect({
    offer,
    onSuccess: result => {
      info('Posted offer', result)

      saveAndUpdate({ ...offer, id: result.offerId })
    },
    onError: err => {
      updateMessage({ msg: i18n(err.error || 'error.postOffer'), level: 'ERROR' })
      back()
    }
  }) : () => {}, []))

  useEffect(offer.id && !offer.escrow ? createEscrowEffect({
    offer,
    onSuccess: result => {
      info('Created escrow', result)
      setEscrow(() => result.escrow)
      setFundingStatus(() => result.funding)
      setUpdatePending(false)
      saveAndUpdate({
        ...offer,
        escrow: result.escrow,
        funding: result.funding,
      })
    },
    onError: err => updateMessage({ msg: i18n(err.error || 'error.createEscrow'), level: 'ERROR' })
  }) : () => {}, [offer.id])

  useEffect(checkFundingStatusEffect({
    offer,
    onSuccess: result => {
      info('Checked funding status', result)

      saveAndUpdate({
        ...offer,
        funding: result.funding,
        returnAddress: result.returnAddress,
      })
      setFundingStatus(() => result.funding)
      setFundingError(() => result.error || '')
    },
    onError: err => {
      updateMessage({
        msg: i18n(err.error || 'error.general'),
        level: 'ERROR',
      })
    },
  }), [offer.id])

  useEffect(() => {
    if (/WRONG_FUNDING_AMOUNT|CANCELED/u.test(fundingStatus.status)) {
      updateOverlay({
        content: <Refund offer={offer} navigate={navigate} />,
        showCloseButton: false
      })
      return
    }

    if (fundingStatus && /FUNDED/u.test(fundingStatus.status)) {
      setStepValid(true)

      next()

      getTradingLimit().then(([tradingLimit]) => {
        if (tradingLimit) {
          updateTradingLimit(tradingLimit)
        }
      })
    }
  }, [fundingStatus])

  useFocusEffect(useCallback(() => { // workaround to update escrow status if offer changes
    setStepValid(false)
    setEscrow(offer.escrow || '')
    setUpdatePending(!offer.escrow)
    setFundingStatus(offer.funding)
  }, []))

  return <View style={tw`px-6`}>
    <Title title={i18n('sell.title')} subtitle={i18n('sell.escrow.subtitle')}
      help={<Escrow />} />
    {updatePending
      ? <Loading />
      : escrow && fundingStatus && !fundingError
        ? <View>
          <Text style={tw`mt-6 mb-5 text-center`}>
            <Text style={tw`font-baloo text-lg uppercase text-grey-2`}>{i18n('sell.escrow.sendSats.1')} </Text>
            <SatsFormat style={tw`font-baloo text-lg uppercase`} sats={fundingAmount} color={tw`text-grey-2`} />
            <Text style={tw`font-baloo text-lg uppercase text-grey-2`}> {i18n('sell.escrow.sendSats.2')}</Text>
          </Text>
          <FundingView escrow={escrow} amount={offer.amount} label={`Peach Escrow - offer ${offer.id}`} />
        </View>
        : <NoEscrowFound />
    }
  </View>
}