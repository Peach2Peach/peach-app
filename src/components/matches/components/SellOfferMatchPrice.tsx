import { View } from 'react-native'
import tw from '../../../styles/tailwind'
import i18n from '../../../utils/i18n'
import { Divider } from '../../Divider'
import { Price } from './Price'

type Props = {
  match: Match
  offer: SellOffer
}
export const SellOfferMatchPrice = ({ match, offer }: Props) => (
  <View style={[tw`gap-1`, tw.md`gap-3`]}>
    <Divider text={i18n('price')} />
    <Price {...{ match, offer }} />
  </View>
)
