import React, { ReactElement, useEffect } from 'react'
import tw from '../../styles/tailwind'
import { useBuySummarySetup } from './hooks/useBuySummarySetup'
import { BuyViewProps } from './BuyPreferences'
import { BuyOfferSummary } from '../../components'

export default ({ offer, setStepValid, updateOffer }: BuyViewProps): ReactElement => {
  const { releaseAddress, walletLabel } = useBuySummarySetup()

  useEffect(() => {
    setStepValid(!!releaseAddress)

    if (releaseAddress) updateOffer({
      ...offer,
      releaseAddress,
    })
  }, [releaseAddress, setStepValid, updateOffer])

  useEffect(() => {
    if (walletLabel) updateOffer({
      ...offer,
      walletLabel,
    })
  }, [walletLabel, updateOffer])

  return <BuyOfferSummary offer={offer} style={tw`mx-8 mt-15`} />
}
