import React, { ReactElement, useEffect } from 'react'
import { SellOfferSummary } from '../../components'
import tw from '../../styles/tailwind'
import { useSellSummarySetup } from './hooks/useSellSummarySetup'
import { SellViewProps } from './SellPreferences'

export default ({ offer, updateOffer, setStepValid }: SellViewProps): ReactElement => {
  const { returnAddress, walletLabel } = useSellSummarySetup()

  useEffect(() => {
    setStepValid(!!returnAddress)

    if (returnAddress) updateOffer({
      ...offer,
      returnAddress,
    })
  }, [returnAddress, setStepValid, updateOffer])

  useEffect(() => {
    if (walletLabel) updateOffer({
      ...offer,
      walletLabel,
    })
  }, [walletLabel, updateOffer])

  return <SellOfferSummary offer={offer} style={tw`mx-8 mt-15`} />
}
