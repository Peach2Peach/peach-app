import React from 'react'
import { Dimensions } from 'react-native'
import Carousel from 'react-native-snap-carousel'
import tw from '../../styles/tailwind'
import { useOfferMatches } from '../../views/search/hooks/useOfferMatches'
import Match from './Match'
import { useMatchStore } from './store'

const { width } = Dimensions.get('window')
const carouselConfig = {
  loop: false,
  enableMomentum: false,
  sliderWidth: width,
  itemWidth: width - 80,
  inactiveSlideScale: 0.9,
  inactiveSlideOpacity: 0.7,
  inactiveSlideShift: -10,
  activeSlideAlignment: 'center' as 'center',
  enableSnap: true,
  shouldOptimizeUpdates: true,
  lockScrollWhileSnapping: true,
  keyExtractor: (item: any, index: number) => `${item.offerId}-${index}`,
}

const renderItem = ({ item }: { item: Match }) => <Match match={item} style={tw`px-4 py-4 -mx-4 bg-transparent`} />

export default () => {
  const { allMatches: matches } = useOfferMatches()

  const setCurrentIndex = useMatchStore((state) => state.setCurrentIndex)
  const onBeforeSnapToItem = (index: number) => {
    setCurrentIndex(Math.min(index, matches.length - 1))
  }

  return <Carousel data={matches} {...{ ...carouselConfig, onBeforeSnapToItem, renderItem }} />
}
