import { View } from 'react-native'
import { Text } from '../../../components'
import { BTCAmount } from '../../../components/bitcoin'
import { getPremiumColor } from '../../../components/matches/utils'
import { useRoute } from '../../../hooks'
import tw from '../../../styles/tailwind'
import i18n from '../../../utils/i18n'
import { useOfferMatches } from '../hooks'

export const MatchInformation = ({ offer }: { offer: SellOffer }) => {
  const { offerId } = useRoute<'search'>().params
  const { allMatches: matches } = useOfferMatches(offerId)
  const color = getPremiumColor(offer.premium || 0, false)

  return (
    <View>
      <Text style={tw`text-center h4 text-primary-main`}>
        {i18n(`search.youGot${matches.length === 1 ? 'AMatch' : 'Matches'}`)}
      </Text>
      <Text style={tw`text-center body-l text-black-2`}>{i18n('search.sellOffer')}:</Text>
      <View style={tw`flex-row items-center justify-center`}>
        <BTCAmount amount={offer.amount} size="medium" />
        {offer.premium !== undefined && (
          <Text style={[tw`leading-loose body-l`, color]}>
            {' '}
            ({offer.premium > 0 ? '+' : ''}
            {String(offer.premium)}%)
          </Text>
        )}
      </View>
    </View>
  )
}
