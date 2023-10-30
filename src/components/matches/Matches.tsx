import { View, useWindowDimensions } from 'react-native'
import Carousel from 'react-native-reanimated-carousel'
import { useIsMediumScreen, useRoute } from '../../hooks'
import { useOfferDetails } from '../../hooks/query/useOfferDetails'
import tw from '../../styles/tailwind'
import { isSellOffer } from '../../utils/offer'
import { MatchInformation } from '../../views/search/components'
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
    <View style={tw`h-full`}>
      {isSellOffer(offer) && <MatchInformation offer={offer} />}
      <View style={tw`shrink`}>
        <Carousel
          {...{ width, onSnapToItem }}
          loop={false}
          snapEnabled
          mode="parallax"
          style={tw`grow`}
          modeConfig={{
            parallaxScrollingScale: 0.9,
            parallaxScrollingOffset: isMediumScreen ? 48 : 40,
          }}
          data={matches}
          renderItem={({ item: match }) => <Match {...{ match, offer }} />}
        />
      </View>
    </View>
  )
}
