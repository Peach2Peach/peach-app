import { useWindowDimensions } from 'react-native'
import Carousel from 'react-native-reanimated-carousel'
import { useIsMediumScreen, useRoute } from '../../hooks'
import { useOfferDetails } from '../../hooks/query/useOfferDetails'
import { useOfferMatches } from '../../views/search/hooks'
import { Match } from './Match'
import { useMatchesSetup } from './hooks'
import { useMatchStore } from './store'

export const Matches = () => {
  const { width } = useWindowDimensions()
  const isMediumScreen = useIsMediumScreen()
  useMatchesSetup()
  const { offerId } = useRoute<'search'>().params
  const { offer } = useOfferDetails(offerId)
  const { allMatches: matches } = useOfferMatches(offerId)

  const setCurrentIndex = useMatchStore((state) => state.setCurrentIndex)
  const onSnapToItem = (index: number) => {
    setCurrentIndex(Math.min(index, matches.length - 1))
  }
  if (!offer) return <></>

  return (
    <Carousel
      {...{ width, onSnapToItem }}
      loop={false}
      snapEnabled
      mode="parallax"
      modeConfig={{
        parallaxScrollingScale: 0.9,
        parallaxScrollingOffset: isMediumScreen ? 48 : 24,
      }}
      data={matches}
      renderItem={({ item: match }) => <Match {...{ match, offer }} />}
    />
  )
}
