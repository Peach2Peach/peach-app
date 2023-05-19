import { View } from 'react-native'
import { AmountSummary } from './AmountSummary'
import { PremiumText } from '../matches/components/PremiumText'
import { Label } from '../text'
import Icon from '../Icon'
import { showAddress } from '../../utils/bitcoin'
import { NETWORK } from '@env'
import tw from '../../styles/tailwind'

const isSellOfferWithDefinedEscrow = (offer: SellOffer | SellOfferDraft): offer is SellOffer & { escrow: string } =>
  'escrow' in offer && !!offer.escrow

type Props = {
  offer: SellOffer | SellOfferDraft
}
export const SellAmountSummary = ({ offer }: Props) => (
  <View>
    <AmountSummary amount={offer.amount} />
    <PremiumText style={tw`text-black-2 body-l`} premium={offer.premium} />
    {isSellOfferWithDefinedEscrow(offer) && (
      <Label
        testID="showEscrow"
        style={tw`border-primary-main absolute right-0 top-1/2`}
        onPress={() => showAddress(offer.escrow, NETWORK)}
      >
        <Icon id="externalLink" style={tw`w-4 h-4`} color={tw`text-primary-main`.color} />
      </Label>
    )}
  </View>
)
