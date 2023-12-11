import { TouchableOpacity, View } from 'react-native'
import { Match } from '../../../peach-api/src/@types/match'
import { PeachScrollView, PriceFormat, Screen, Text } from '../../components'
import { horizontalBadgePadding } from '../../components/Badge'
import { PeachyBackground } from '../../components/PeachyBackground'
import { BTCAmount } from '../../components/bitcoin'
import { Badges } from '../../components/matches/components/Badges'
import { useBitcoinPrices, useNavigation } from '../../hooks'
import { useRoute } from '../../hooks/useRoute'
import tw from '../../styles/tailwind'
import i18n from '../../utils/i18n'
import { LoadingScreen } from '../loading/LoadingScreen'
import { BuyBitcoinHeader } from '../offerPreferences/BuyBitcoinHeader'
import { MarketInfo } from '../offerPreferences/components/MarketInfo'
import { useOfferMatches } from '../search/hooks'
import { Rating } from '../settings/profile/profileOverview/components'

export function Explore () {
  const { offerId } = useRoute<'explore'>().params
  const { allMatches: matches, isLoading } = useOfferMatches(offerId)
  const hasMatches = matches.length > 0
  if (isLoading) return <LoadingScreen />
  return (
    <Screen header={<BuyBitcoinHeader />}>
      {hasMatches ? (
        <PeachScrollView contentStyle={tw`gap-10px`}>
          <MarketInfo type="sellOffers" />
          <OfferSummaryCards />
        </PeachScrollView>
      ) : (
        <View style={tw`items-center justify-center flex-1 gap-4`}>
          <MarketInfo type="sellOffers" />
          <Text style={tw`text-center subtitle-2`}>{i18n('search.weWillNotifyYou')}</Text>
        </View>
      )}
    </Screen>
  )
}

function OfferSummaryCards () {
  const { offerId } = useRoute<'explore'>().params
  const { allMatches: matches } = useOfferMatches(offerId)
  return (
    <>
      {matches.map((match, index) => (
        <ExploreCard key={match.offerId} match={matches[index]} />
      ))}
    </>
  )
}

function ExploreCard ({ match }: { match: Match }) {
  const { matched, amount, user, premium, instantTrade } = match
  const { fiatPrice, displayCurrency } = useBitcoinPrices(amount)
  const { offerId } = useRoute<'explore'>().params
  const navigation = useNavigation()
  const onPress = () => {
    navigation.navigate('matchDetails', { matchId: match.offerId, offerId })
  }

  return (
    <TouchableOpacity
      style={[
        tw`justify-center overflow-hidden border bg-primary-background-light rounded-2xl border-primary-main`,
        matched && tw`border-2 border-success-main`,
      ]}
      onPress={onPress}
    >
      {instantTrade && (
        <View style={tw`overflow-hidden rounded-md`}>
          <PeachyBackground />
          <Text style={tw`text-center py-2px subtitle-2 text-primary-background-light`}>instant trade</Text>
        </View>
      )}
      <View style={tw`justify-center py-2 px-9px`}>
        <View style={[tw`flex-row items-center justify-between`, { paddingLeft: horizontalBadgePadding }]}>
          <Rating rating={user.rating} />
          <BTCAmount amount={amount} size="small" />
        </View>
        <View style={tw`flex-row items-center justify-between`}>
          <Badges id={user.id} unlockedBadges={user.medals} />
          <Text style={tw`text-center`}>
            <PriceFormat style={tw`tooltip`} currency={displayCurrency} amount={fiatPrice} />
            <Text style={tw`text-black-2`}>
              {' '}
              ({premium >= 0 ? '+' : '-'}
              {premium}%)
            </Text>
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  )
}
