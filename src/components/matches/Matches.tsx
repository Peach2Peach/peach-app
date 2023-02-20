import React from 'react'
import { Dimensions } from 'react-native'
import Carousel from 'react-native-snap-carousel'
import { useRoute } from '../../hooks'
import { useOfferDetails } from '../../hooks/query/useOfferDetails'
import tw from '../../styles/tailwind'
import { useOfferMatches } from '../../views/search/hooks/useOfferMatches'
import { useMatchesSetup } from './hooks'
import { Match } from './Match'
import { useMatchStore } from './store'

const { width } = Dimensions.get('window')
const carouselConfig = {
  loop: false,
  enableMomentum: false,
  sliderWidth: width,
  itemWidth: width - 64,
  inactiveSlideScale: 0.9,
  inactiveSlideOpacity: 0.7,
  inactiveSlideShift: -10,
  activeSlideAlignment: 'center' as 'center',
  enableSnap: true,
  shouldOptimizeUpdates: true,
  lockScrollWhileSnapping: true,
  keyExtractor: (item: any, index: number) => `${item.offerId}-${index}`,
}

export const Matches = () => {
  useMatchesSetup()
  const { offerId } = useRoute<'search'>().params
  const { offer } = useOfferDetails(offerId)
  const { allMatches: matches } = useOfferMatches(offerId)

  const setCurrentIndex = useMatchStore((state) => state.setCurrentIndex)
  const onBeforeSnapToItem = (index: number) => {
    setCurrentIndex(Math.min(index, matches.length - 1))
  }
  if (!offer) return <></>

  return (
    <Carousel
      data={matches}
      renderItem={({ item }) => <Match match={item} offer={offer} />}
      {...{ ...carouselConfig, onBeforeSnapToItem }}
    />
  )
}
