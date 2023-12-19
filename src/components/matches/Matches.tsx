import { useState } from 'react'
import { View, useWindowDimensions } from 'react-native'
import Carousel from 'react-native-reanimated-carousel'
import { useIsMediumScreen, useRoute } from '../../hooks'
import tw from '../../styles/tailwind'
import i18n from '../../utils/i18n'
import { useOfferMatches } from '../../views/search/hooks'
import { BTCAmount } from '../bitcoin/btcAmount/BTCAmount'
import { PeachText } from '../text/PeachText'
import { Match } from './Match'
import { getPremiumColor } from './utils/getPremiumColor'

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

function MatchInformation ({ offer }: { offer: SellOffer }) {
  const { offerId } = useRoute<'search'>().params
  const { allMatches: matches } = useOfferMatches(offerId)
  const color = getPremiumColor(offer.premium || 0, false)

  return (
    <View>
      <PeachText style={tw`text-center h4 text-primary-main`}>
        {i18n(`search.youGot${matches.length === 1 ? 'AMatch' : 'Matches'}`)}
      </PeachText>
      <PeachText style={tw`text-center body-l text-black-2`}>{i18n('search.sellOffer')}:</PeachText>
      <View style={tw`flex-row items-center justify-center`}>
        <BTCAmount amount={offer.amount} size="medium" />
        {offer.premium !== undefined && (
          <PeachText style={[tw`leading-loose body-l`, color]}>
            {' '}
            ({offer.premium > 0 ? '+' : ''}
            {String(offer.premium)}%)
          </PeachText>
        )}
      </View>
    </View>
  )
}
