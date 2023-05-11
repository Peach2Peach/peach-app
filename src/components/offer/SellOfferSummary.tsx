import { NETWORK } from '@env'
import { ReactElement } from 'react'
import { TouchableOpacity, View } from 'react-native'
import tw from '../../styles/tailwind'
import { showAddress } from '../../utils/bitcoin'
import i18n from '../../utils/i18n'
import Icon from '../Icon'
import { PremiumText } from '../matches/components/PremiumText'
import { Text } from '../text'
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
    </View>
    <PaymentMethodsSummary meansOfPayment={offer.meansOfPayment} />
    <PayoutWalletSummary offer={offer} walletLabel={offer.walletLabel} address={offer.returnAddress} />
    <HorizontalLine style={tw`w-64 my-4`} />

    {isSellOfferWithDefinedEscrow(offer) && (
      <>
        <HorizontalLine style={tw`w-64 my-4`} />
        <TouchableOpacity style={tw`flex-row items-end self-center`} onPress={() => showAddress(offer.escrow, NETWORK)}>
          <Text style={tw`underline tooltip text-black-2`}>{i18n('escrow.viewInExplorer')}</Text>
          <Icon id="externalLink" style={tw`w-[18px] h-[18px] ml-[2px] mb-[2px]`} color={tw`text-primary-main`.color} />
        </TouchableOpacity>
      </>
    )}
  </View>
)
