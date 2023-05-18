import { ReactElement } from 'react'
import { View } from 'react-native'
import tw from '../../styles/tailwind'
import { AmountRangeSummary } from './AmountRangeSummary'
import { PaymentMethodsSummary } from './PaymentMethodsSummary'
import { PayoutWalletSummary } from './PayoutWalletSummary'

type Props = ComponentProps & {
  offer: BuyOffer | BuyOfferDraft
}

export const BuyOfferSummary = ({ offer, style }: Props): ReactElement => (
  <View style={[tw`gap-4`, tw.md`gap-12`, style]}>
    <AmountRangeSummary amount={offer.amount} />
    <PaymentMethodsSummary meansOfPayment={offer.meansOfPayment} />
    <PayoutWalletSummary offer={offer} />
  </View>
)
