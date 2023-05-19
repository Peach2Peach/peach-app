import { View } from 'react-native'
import tw from '../../styles/tailwind'
import { PaymentMethodsSummary } from './PaymentMethodsSummary'
import { PayoutWalletSummary } from './PayoutWalletSummary'
import { SellAmountSummary } from './SellAmountSummary'

type Props = ComponentProps & {
  offer: SellOffer | SellOfferDraft
}

export const SellOfferSummary = ({ offer, style }: Props) => (
  <View style={[tw`gap-4`, tw.md`gap-12`, style]}>
    <SellAmountSummary offer={offer} />
    <PaymentMethodsSummary meansOfPayment={offer.meansOfPayment} />
    <PayoutWalletSummary offer={offer} />
  </View>
)
