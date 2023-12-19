import { useState } from 'react'
import { View, useWindowDimensions } from 'react-native'
import Carousel from 'react-native-reanimated-carousel'
import { useIsMediumScreen } from '../../hooks/useIsMediumScreen'
import { useRoute } from '../../hooks/useRoute'
import tw from '../../styles/tailwind'
import { MatchInformation } from '../../views/search/components/MatchInformation'
import { useOfferMatches } from '../../views/search/hooks'
import { Match } from './Match'

export const Matches = ({ offer }: { offer: SellOffer }) => {
  const { width } = useWindowDimensions()
  const isMediumScreen = useIsMediumScreen()
  const { offerId } = useRoute<'search'>().params
  const { allMatches: matches, fetchNextPage, hasNextPage } = useOfferMatches(offerId)
  const [currentPage, setCurrentPage] = useState(0)

  const onSnapToItem = (index: number) => {
    const newIndex = Math.min(index, matches.length - 1)
    setCurrentPage(Math.floor(newIndex / 10))
    if (newIndex === matches.length - 1 && hasNextPage) fetchNextPage()
  }

  return (
    <View style={tw`h-full`}>
      <MatchInformation offer={offer} />
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
          renderItem={({ item: match }) => <Match {...{ match, offer, currentPage }} />}
        />
      </View>
    </View>
  )
}
