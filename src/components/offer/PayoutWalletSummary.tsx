import { View } from 'react-native'
import tw from '../../styles/tailwind'
import i18n from '../../utils/i18n'
import { TradeSeparator } from './TradeSeparator'
import { WalletSelector } from './WalletSelector'
import { getWalletType } from '../../utils/offer'

type Props = {
  offer: BuyOffer | BuyOfferDraft | SellOffer | SellOfferDraft
}
export const PayoutWalletSummary = ({ offer }: Props) => (
  <View style={tw`gap-1`}>
    <TradeSeparator text={i18n(`${getWalletType(offer)}.wallet`)} />
    <WalletSelector offer={offer} />
  </View>
)
