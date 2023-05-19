import { View } from 'react-native'
import tw from '../../styles/tailwind'
import i18n from '../../utils/i18n'
import { getWalletType } from '../../utils/offer'
import { Divider } from '../Divider'
import { WalletSelector } from './WalletSelector'

type Props = {
  offer: BuyOffer | BuyOfferDraft | SellOffer | SellOfferDraft
}
export const PayoutWalletSummary = ({ offer }: Props) => (
  <View style={tw`gap-1 items-start`}>
    <Divider text={i18n(`${getWalletType(offer)}.wallet`)} />
    <WalletSelector offer={offer} />
  </View>
)
