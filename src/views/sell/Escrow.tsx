import React, { ReactElement, useContext, useEffect, useState } from 'react'
import { View } from 'react-native'
import tw from '../../styles/tailwind'

import LanguageContext from '../../components/inputs/LanguageSelect'
import i18n from '../../utils/i18n'
import { SellViewProps } from './Sell'
import { saveOffer } from '../../utils/offer'
import { MessageContext } from '../../utils/messageUtils'
import createEscrowEffect from './effects/createEscrowEffect'
import checkFundingStatusEffect from './effects/checkFundingStatusEffect'
import Refund from './components/Refund'
import FundingView from './components/FundingView'
import NoEscrowFound from './components/NoEscrowFound'
import { PEACHFEE } from '../../constants'
import { thousands } from '../../utils/string'
import EscrowHelp from './components/EscrowHelp'
import { Title } from '../../components'
import { info } from '../../utils/log'

const defaultFunding: FundingStatus = {
  confirmations: 0,
  status: 'NULL',
  amount: 0
}

// eslint-disable-next-line max-lines-per-function
export default ({ offer, updateOffer, setStepValid, next, navigation }: SellViewProps): ReactElement => {
  useContext(LanguageContext)
  const [, updateMessage] = useContext(MessageContext)
  const [escrow, setEscrow] = useState(offer.escrow || '')
  const [fundingError, setFundingError] = useState<FundingError>('')
  const [fundingStatus, setFundingStatus] = useState<FundingStatus>(offer.funding || defaultFunding)
  const fundingAmount = Math.round(offer.amount * (1 + PEACHFEE / 100))
  const fees = Math.round(offer.amount * PEACHFEE / 100)

  const saveAndUpdate = (offerData: SellOffer) => {
    updateOffer(offerData)
    saveOffer(offerData)
  }

  useEffect(createEscrowEffect({
    offer,
    onSuccess: result => {
      info('Created escrow', result)
      setEscrow(() => result.escrow)
      setFundingStatus(() => result.funding)
      saveAndUpdate({
        ...offer,
        escrow: result.escrow,
        funding: result.funding,
      })
    },
    onError: () => updateMessage({ msg: i18n('error.createEscrow'), level: 'ERROR' })
  }), [offer.id])

  useEffect(checkFundingStatusEffect({
    offer,
    onSuccess: result => {
      info('Checked funding status', result)

      saveAndUpdate({
        ...offer,
        funding: result.funding,
        returnAddress: result.returnAddress,
        depositAddress: offer.depositAddress || result.returnAddress,
      })
      setFundingStatus(() => result.funding)
      setFundingError(() => result.error || '')
    },
    onError: (err) => {
      updateMessage({
        msg: i18n(err.error || 'error.general'),
        level: 'ERROR',
      })
    },
  }), [escrow])

  useEffect(() => {
    if (fundingStatus && /MEMPOOL|FUNDED/u.test(fundingStatus.status)) {
      setStepValid(true)
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
    setFundingStatus(() => offer.funding || defaultFunding)
  }, [offer.id])

  info('Rendering escrow', offer)
  return <View>
    <Title title={i18n('sell.title')} subtitle={i18n('sell.escrow.subtitle', thousands(fundingAmount))}
      help={<EscrowHelp fees={fees}/>}
    />
    {escrow && fundingStatus && !fundingError
      ? /WRONG_FUNDING_AMOUNT|CANCELED/u.test(fundingStatus.status)
        ? <View style={tw`mt-4`}>
          <Refund offer={offer} />
        </View>
        : <FundingView escrow={escrow} />
      : <NoEscrowFound />
    }
  </View>
}