import { View } from 'react-native'
import tw from '../../styles/tailwind'
import i18n from '../../utils/i18n'
import { TradeSeparator } from './TradeSeparator'
import { WalletSelector } from './WalletSelector'

type Props = {
  offer: BuyOffer | BuyOfferDraft | SellOffer | SellOfferDraft
}
export const PayoutWalletSummary = ({ offer }: Props) => {
  const type = offer.type === 'ask' ? 'refund' : 'payout'
  return (
    <View>
      <TradeSeparator text={i18n(`${type}.wallet`)} />
      <WalletSelector offer={offer} style={tw`mt-1`} />
    </View>
  )
}
