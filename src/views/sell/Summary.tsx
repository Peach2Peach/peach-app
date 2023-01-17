import React, { ReactElement, useEffect } from 'react'
import { View } from 'react-native'
import { SellOfferSummary } from '../../components'
import tw from '../../styles/tailwind'
import { useSellSummarySetup } from './hooks/useSellSummarySetup'
import { SellViewProps } from './SellPreferences'

export default ({ offer, setStepValid }: SellViewProps): ReactElement => {
  useSellSummarySetup()

  useEffect(() => setStepValid(true))

  return (
    <View style={tw`flex-col justify-center h-full px-6`}>
      <SellOfferSummary offer={offer} style={tw`flex-shrink-0`} />
    </View>
  )
}
