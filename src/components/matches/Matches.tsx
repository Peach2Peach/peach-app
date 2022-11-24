import React, { ReactElement, useEffect } from 'react'
import { unique } from '../../utils/array'
import { saveOffer } from '../../utils/offer'
import MatchCarousel from './MatchCarousel'
import { View } from 'react-native'
import tw from '../../styles/tailwind'
import { useOfferMatches } from '../../views/search/hooks/useOfferMatches'
import { RouteProp, useRoute } from '@react-navigation/native'
import { MatchOfferButton, MatchHelpButton } from './buttons'
import { useMatchStore } from './store'

/**
 * @description Component to display matches to the offer of the current route
 * @example
 * <Matches />
 */
export const Matches = (): ReactElement => {
  const { offer } = useRoute<RouteProp<{ params: RootStackParamList['search'] }>>().params
  const {
    data: { matches },
    refetchOnEnd,
  } = useOfferMatches()

  const { currentIndex, setCurrentIndex } = useMatchStore((state) => ({
    currentIndex: state.currentIndex,
    setCurrentIndex: state.setCurrentIndex,
  }))

  useEffect(() => {
    setCurrentIndex(0)
  }, [setCurrentIndex])

  useEffect(() => {
    const seenMatches = (offer.seenMatches || []).concat([matches[currentIndex]?.offerId]).filter(unique())
    saveOffer({
      ...offer,
      seenMatches,
    })
    refetchOnEnd()
  }, [currentIndex, matches, offer, refetchOnEnd])

  return (
    <View style={tw`h-full flex-shrink flex-col justify-end`}>
      <MatchCarousel />
      <View style={tw`flex-row items-center justify-center pl-11`}>
        <MatchOfferButton />
        <MatchHelpButton />
      </View>
    </View>
  )
}

export default Matches
