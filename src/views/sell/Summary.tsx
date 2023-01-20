import React, { ReactElement, useEffect } from 'react'
import { View } from 'react-native'
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
  return (
    <View style={tw`flex-col justify-center h-full px-6`}>
      <SellOfferSummary offer={offer} style={tw`flex-shrink-0`} />
    </View>
  )
}
