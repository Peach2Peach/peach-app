import { useWindowDimensions } from 'react-native'
import Carousel from 'react-native-snap-carousel'
import { useIsMediumScreen, useRoute } from '../../hooks'
import { useOfferDetails } from '../../hooks/query/useOfferDetails'
import { useOfferMatches } from '../../views/search/hooks'
import { Match } from './Match'
import { useMatchesSetup } from './hooks'
import { useMatchStore } from './store'

export const Matches = () => {
  const { width } = useWindowDimensions()
  const isMediumScreen = useIsMediumScreen()
  const carouselConfig = {
    loop: false,
    enableMomentum: false,
    sliderWidth: width,
    itemWidth: width - (isMediumScreen ? 48 : 24),
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
