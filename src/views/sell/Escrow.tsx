import React, { ReactElement, useContext, useEffect, useState } from 'react'
import { View } from 'react-native'
import tw from '../../styles/tailwind'

import LanguageContext from '../../components/inputs/LanguageSelect'
import { Text } from '../../components'
import i18n from '../../utils/i18n'
import { SellViewProps } from './Sell'
import { saveOffer } from '../../utils/accountUtils'
import { MessageContext } from '../../utils/messageUtils'
import createEscrowEffect from './effects/createEscrowEffect'
import checkFundingStatusEffect from './effects/checkFundingStatusEffect'
import Refund from './components/Refund'
import FundingView from './components/FundingView'
import NoEscrowFound from './components/NoEscrowFound'

const defaultFunding: FundingStatus = {
  confirmations: 0,
  status: 'NULL',
  amount: 0
}

export default ({ offer, updateOffer, setStepValid }: SellViewProps): ReactElement => {
  useContext(LanguageContext)
  const [, updateMessage] = useContext(MessageContext)

  const [escrow, setEscrow] = useState(offer.escrow || '')
  const [fundingError, setFundingError] = useState<FundingError>('')
  const [fundingStatus, setFundingStatus] = useState<FundingStatus>(offer.funding || defaultFunding)

  const saveAndUpdate = (offerData: SellOffer) => {
    updateOffer(offerData)
    saveOffer(offerData)
  }

  useEffect(createEscrowEffect({
    offer,
    onSuccess: result => {
      setEscrow(() => result.escrow)
      setFundingStatus(() => result.funding)
      saveAndUpdate({
        ...offer,
        escrow: result.escrow,
        funding: result.funding,
      })
    },
    onError: () => {
      updateMessage({
        msg: i18n('error.createEscrow'),
        level: 'ERROR',
      })
    }
  }), [])

  useEffect(checkFundingStatusEffect({
    offer,
    onSuccess: result => {
      setFundingStatus(() => result.funding)
      saveAndUpdate({
        ...offer,
        funding: result.funding,
      })
      setFundingError(() => result.error || '')
    },
    onError: () => {
      // TODO treat API Error case (404, 500, etc)
    },
  }), [offer.offerId])

  useEffect(() => {
    if (fundingStatus && /MEMPOOL|FUNDED/u.test(fundingStatus.status)) setStepValid(true)
  }, [fundingStatus])

  useEffect(() => {
    // workaround to update escrow status if offer changes
    setEscrow(() => offer.escrow || '')
    setFundingStatus(() => offer.funding || defaultFunding)
  }, [offer.offerId])

  return <View style={tw`mt-16`}>
    {fundingStatus && !fundingError
      ? <FundingView offer={offer} escrow={escrow} fundingStatus={fundingStatus} />
      : fundingError && fundingError === 'WRONG_FUNDING_AMOUNT'
        ? <Refund />
        : <NoEscrowFound />
    }
  </View>
}