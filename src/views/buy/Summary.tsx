import React, { ReactElement, useEffect } from 'react'
import tw from '../../styles/tailwind'
import { useBuySummarySetup } from './hooks/useBuySummarySetup'
import { BuyViewProps } from './BuyPreferences'
import { BuyOfferSummary } from '../../components'
import { isValidBitcoinSignature } from '../../utils/validation'

export default ({ offer, setStepValid, updateOffer }: BuyViewProps): ReactElement => {
  const { releaseAddress, walletLabel, message, messageSignature } = useBuySummarySetup()

  useEffect(() => {
    setStepValid(isValidBitcoinSignature(message, releaseAddress, messageSignature))

    if (releaseAddress) updateOffer({
      ...offer,
      releaseAddress,
      message,
      messageSignature,
    })
  }, [releaseAddress, message, messageSignature, setStepValid, updateOffer])

  useEffect(() => {
    if (walletLabel) updateOffer({
      ...offer,
      walletLabel,
    })
  }, [walletLabel, updateOffer])

  return <BuyOfferSummary offer={offer} style={tw`mx-8 mt-15`} />
}
