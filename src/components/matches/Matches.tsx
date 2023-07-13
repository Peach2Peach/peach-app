import { useWindowDimensions } from 'react-native'
import Carousel from 'react-native-snap-carousel'
import { useRoute } from '../../hooks'
import { useOfferDetails } from '../../hooks/query/useOfferDetails'
import { useOfferMatches } from '../../views/search/hooks'
import { useMatchesSetup } from './hooks'
import { Match } from './Match'
import { useMatchStore } from './store'

export const Matches = () => {
  const { width } = useWindowDimensions()
  const carouselConfig = {
    loop: false,
    enableMomentum: false,
    sliderWidth: width,
    itemWidth: width - 64,
    inactiveSlideScale: 0.9,
    inactiveSlideOpacity: 0.7,
    inactiveSlideShift: -10,
    activeSlideAlignment: 'center' as const,
    enableSnap: true,
    shouldOptimizeUpdates: true,
    lockScrollWhileSnapping: true,
    keyExtractor: (item: Match, index: number) => `${item.offerId}-${index}`,
  }
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
      renderItem={({ item: match }) => <Match {...{ match, offer }} />}
      {...{ ...carouselConfig, onBeforeSnapToItem }}
    />
  )
}
