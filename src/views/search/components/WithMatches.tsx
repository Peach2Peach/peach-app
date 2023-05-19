import { View } from 'react-native'
import { Matches } from '../../../components'
import tw from '../../../styles/tailwind'
import { MatchesTitle } from './MatchesTitle'

type Props = {
  offer: BuyOffer | SellOffer
}
export const WithMatches = ({ offer }: Props) => (
  <View style={[tw`gap-5`, tw.md`gap-12`]}>
    <MatchesTitle offer={offer} />
    <Matches />
  </View>
)
