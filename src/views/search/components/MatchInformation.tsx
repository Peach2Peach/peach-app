import { View } from 'react-native'
import { BTCAmount } from '../../../components/bitcoin/btcAmount/BTCAmount'
import { getPremiumColor } from '../../../components/matches/utils/getPremiumColor'
import { PeachText } from '../../../components/text/PeachText'
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
