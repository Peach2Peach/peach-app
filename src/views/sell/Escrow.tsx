import React, { ReactElement, useContext, useEffect, useState } from 'react'
import LanguageContext from '../../contexts/language'
import i18n from '../../utils/i18n'
import { SellViewProps } from './Sell'
import { saveOffer } from '../../utils/offer'
import { MessageContext } from '../../contexts/message'
import createEscrowEffect from './effects/createEscrowEffect'
import checkFundingStatusEffect from '../../effects/checkFundingStatusEffect'
import FundingView from './components/FundingView'
import NoEscrowFound from './components/NoEscrowFound'
import { thousands } from '../../utils/string'
import EscrowHelp from './components/EscrowHelp'
import { Loading, Title } from '../../components'
import { info } from '../../utils/log'
import postOfferEffect from '../../effects/postOfferEffect'
import { View } from 'react-native'

const defaultFunding: FundingStatus = {
  confirmations: 0,
  status: 'NULL',
  amount: 0
}

// eslint-disable-next-line max-lines-per-function
export default ({ offer, updateOffer, setStepValid, next, navigation }: SellViewProps): ReactElement => {
  useContext(LanguageContext)
  const [, updateMessage] = useContext(MessageContext)
  const [updatePending, setUpdatePending] = useState(true)
  const [escrow, setEscrow] = useState('')
  const [fundingError, setFundingError] = useState<FundingError>('')
  const [fundingStatus, setFundingStatus] = useState<FundingStatus>(offer.funding || defaultFunding)
  const fundingAmount = Math.round(offer.amount)

  const saveAndUpdate = (offerData: SellOffer) => {
    updateOffer(() => offerData)
    saveOffer(offerData)
  }

  useEffect(!offer.id ? postOfferEffect({
    offer,
    onSuccess: result => {
      info('Posted offer', result)

      saveAndUpdate({ ...offer, id: result.offerId })
    },
    onError: err => updateMessage({ msg: i18n(err.error || 'error.postOffer'), level: 'ERROR' })
  }) : () => {}, [])

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

  useEffect(offer.escrow && offer.funding?.status !== 'FUNDED' ? checkFundingStatusEffect({
    offer,
    onSuccess: result => {
      info('Checked funding status', result)

      saveAndUpdate({
        ...offer,
        funding: result.funding,
        // TODO this should not be necessary after updating sell offer order
        returnAddress: result.returnAddress,
        depositAddress: offer.depositAddress || result.returnAddress,
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
  }) : () => {}, [offer.escrow])

  useEffect(() => {
    if (/WRONG_FUNDING_AMOUNT|CANCELED/u.test(fundingStatus.status)) {
      navigation.navigate('refund', { offer })
      return
    }

    if (fundingStatus && /MEMPOOL|FUNDED/u.test(fundingStatus.status)) {
      setStepValid(true)

      if (!offer.published) saveAndUpdate({ ...offer, published: true })

      if (!offer.confirmedReturnAddress) {
        next()
      } else {
        navigation.navigate('search', { offer })
      }
    }
  }, [fundingStatus])

  useEffect(() => { // workaround to update escrow status if offer changes
    setStepValid(false)
    setEscrow(() => offer.escrow || '')
    setUpdatePending(!offer.escrow)
    setFundingStatus(() => offer.funding || defaultFunding)
  }, [offer.id])

  return <View>
    <Title title={i18n('sell.title')} subtitle={i18n('sell.escrow.subtitle', thousands(fundingAmount))}
      help={<EscrowHelp />} />
    {updatePending
      ? <Loading />
      : escrow && fundingStatus && !fundingError
        ? <FundingView escrow={escrow} amount={offer.amount} label={`Peach Escrow - offer ${offer.id}`} />
        : <NoEscrowFound />
    }
  </View>
}