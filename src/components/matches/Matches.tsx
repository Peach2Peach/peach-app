import { useEffect } from 'react'
import { View, useWindowDimensions } from 'react-native'
import Carousel from 'react-native-reanimated-carousel'
import { useIsMediumScreen, useRoute } from '../../hooks'
import { useOfferDetails } from '../../hooks/query/useOfferDetails'
import tw from '../../styles/tailwind'
import { isSellOffer } from '../../utils/offer'
import { MatchInformation } from '../../views/search/components'
import { useOfferMatches } from '../../views/search/hooks'
import { Match } from './Match'
import { useMatchStore } from './store'

export const Matches = () => {
  const { width } = useWindowDimensions()
  const isMediumScreen = useIsMediumScreen()
  const { offerId } = useRoute<'search'>().params
  const { offer } = useOfferDetails(offerId)
  const { allMatches: matches, fetchNextPage, hasNextPage } = useOfferMatches(offerId)

  const setCurrentPage = useMatchStore((state) => state.setCurrentPage)

  useEffect(() => {
    setCurrentPage(0)
    return () => setCurrentPage(0)
  }, [setCurrentPage])

  const onSnapToItem = (index: number) => {
    const newIndex = Math.min(index, matches.length - 1)
    setCurrentPage(Math.floor(newIndex / 10))
    if (newIndex === matches.length - 1 && hasNextPage) fetchNextPage()
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
