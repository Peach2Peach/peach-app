import { NETWORK } from '@env'
import { TouchableOpacity } from 'react-native'
import tw from '../../styles/tailwind'
import { showAddress } from '../../utils/bitcoin'
import i18n from '../../utils/i18n'
import { BTCAmount } from '../bitcoin'
import { Icon } from '../Icon'
import { getPremiumColor } from '../matches/utils'
import { Text } from '../text'
import { HorizontalLine } from '../ui'
import { SummaryCard } from './SummaryCard'
import { WalletLabel } from './WalletLabel'

type Props = {
  offer: SellOffer | SellOfferDraft
}

const isSellOfferWithDefinedEscrow = (offer: SellOffer | SellOfferDraft): offer is SellOffer & { escrow: string } =>
  'escrow' in offer && !!offer.escrow

export const SellOfferSummary = ({ offer }: Props) => (
  <SummaryCard>
    <SummaryCard.Section>
      <Text style={tw`mb-1 text-center text-black-2`}>
        {i18n(`offer.summary.${offer.tradeStatus !== 'offerCanceled' ? 'youAreSelling' : 'youWereSelling'}`)}
      </Text>
      <BTCAmount amount={offer.amount} size="small" />
    </SummaryCard.Section>

    <HorizontalLine />

    <SummaryCard.Section>
      <Text style={tw`text-center text-black-2`}>{i18n('offer.summary.withA')}</Text>
      <Text style={[tw`text-center subtitle-1`, getPremiumColor(offer.premium, false)]}>
        <Text style={tw`subtitle-1`}>{Math.abs(offer.premium)}% </Text>
        {i18n(offer.premium >= 0 ? 'offer.summary.premium' : 'offer.summary.discount')}
      </Text>
    </SummaryCard.Section>

    <HorizontalLine />

    <SummaryCard.PaymentMethods offer={offer} />

    <HorizontalLine />

    <SummaryCard.Section>
      <Text style={tw`text-center text-black-2`}>{i18n('offer.summary.refundWallet')}</Text>
      <Text style={tw`text-center subtitle-1`}>
        <WalletLabel label={offer.walletLabel} address={offer.returnAddress} />
      </Text>
    </SummaryCard.Section>

    {isSellOfferWithDefinedEscrow(offer) && (
      <>
        <HorizontalLine />

        <SummaryCard.Section>
          <TouchableOpacity style={tw`flex-row items-center gap-1`} onPress={() => showAddress(offer.escrow, NETWORK)}>
            <Text style={tw`underline tooltip text-black-2`}>{i18n('escrow.viewInExplorer')}</Text>
            <Icon id="externalLink" size={18} color={tw`text-primary-main`.color} />
          </TouchableOpacity>
        </SummaryCard.Section>
      </>
    )}
  </SummaryCard>
)
