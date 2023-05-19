import { View } from 'react-native'
import i18n from '../../../utils/i18n'
import { TradeSeparator } from '../../offer/TradeSeparator'
import { Price } from './Price'
import tw from '../../../styles/tailwind'

type Props = {
  match: Match
  offer: SellOffer
}
export const SellOfferMatchPrice = ({ match, offer }: Props) => (
  <View style={[tw`gap-1`, tw.md`gap-3`]}>
    <TradeSeparator text={i18n('price')} />
    <Price {...{ match, offer }} />
  </View>
)
