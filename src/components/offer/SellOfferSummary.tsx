import { NETWORK } from '@env'
import { ReactElement } from 'react'
import { View } from 'react-native'
import tw from '../../styles/tailwind'
import { showAddress } from '../../utils/bitcoin'
import Icon from '../Icon'
import { PremiumText } from '../matches/components/PremiumText'
import { Label } from '../text'
import { HorizontalLine } from '../ui'
import { AmountSummary } from './AmountSummary'
import { PaymentMethodsSummary } from './PaymentMethodsSummary'
import { PayoutWalletSummary } from './PayoutWalletSummary'

type Props = ComponentProps & {
  offer: SellOffer | SellOfferDraft
}

const isSellOfferWithDefinedEscrow = (offer: SellOffer | SellOfferDraft): offer is SellOffer & { escrow: string } =>
  'escrow' in offer && !!offer.escrow

export const SellOfferSummary = ({ offer, style }: Props): ReactElement => (
  <View style={[tw`gap-4`, tw.md`gap-12`, style]}>
    <View>
      <AmountSummary amount={offer.amount} />
      <PremiumText style={tw`text-black-2 body-l`} premium={offer.premium} />
      {isSellOfferWithDefinedEscrow(offer) && (
        <Label
          testID="showEscrow"
          style={tw`border-primary-main absolute right-0 top-10`}
          onPress={() => showAddress(offer.escrow, NETWORK)}
        >
          <Icon id="externalLink" style={tw`w-4 h-4`} color={tw`text-primary-main`.color} />
        </Label>
      )}
    </View>
    <PaymentMethodsSummary meansOfPayment={offer.meansOfPayment} />
    <PayoutWalletSummary offer={offer} walletLabel={offer.walletLabel} address={offer.returnAddress} />
    <HorizontalLine style={tw`w-64 my-4`} />
  </View>
)
