import React, { ReactElement, useEffect } from 'react'
import { View } from 'react-native'
import tw from '../../styles/tailwind'
import { useBuySummarySetup } from './hooks/useBuySummarySetup'
import { BuyViewProps } from './BuyPreferences'
import { BuyOfferSummary } from '../../components'

export default ({ offer, setStepValid, updateOffer }: BuyViewProps): ReactElement => {
  const { releaseAddress } = useBuySummarySetup()

  useEffect(() => {
    setStepValid(!!releaseAddress)

    if (releaseAddress) updateOffer({
      ...offer,
      releaseAddress,
    })
  }, [releaseAddress, setStepValid, updateOffer])

  return (
    <View style={tw`flex-col justify-center h-full px-8`}>
      <BuyOfferSummary offer={offer} style={tw`flex-shrink-0`} />
    </View>
  )
}
