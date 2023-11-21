import { NETWORK } from '@env'
import { TouchableOpacity, View } from 'react-native'
import tw from '../../styles/tailwind'
import { showAddress } from '../../utils/bitcoin'
import i18n from '../../utils/i18n'
import { Icon } from '../Icon'
import { BTCAmount } from '../bitcoin'
import { getPremiumColor } from '../matches/utils'
import { Text } from '../text'
import { HorizontalLine } from '../ui'
import { SummaryCard } from './SummaryCard'

type Props = {
  offer: Pick<SellOffer | SellOfferDraft, 'amount' | 'tradeStatus' | 'premium' | 'meansOfPayment'> & {
    escrow?: string
  }
  numberOfOffers?: number
  walletLabel: JSX.Element
}

const isSellOfferWithDefinedEscrow = (
  offer: Pick<SellOffer | SellOfferDraft, 'amount' | 'tradeStatus' | 'premium' | 'meansOfPayment'> & {
    escrow?: string
  },
): offer is SellOffer & { escrow: string } => 'escrow' in offer && !!offer.escrow

export const SellOfferSummary = ({ offer, numberOfOffers, walletLabel }: Props) => {
  const { tradeStatus, amount, premium, meansOfPayment } = offer
  return (
    <SummaryCard>
      <SummaryCard.Section>
        <Text style={tw`text-center text-black-2`}>
          {i18n(`offer.summary.${tradeStatus !== 'offerCanceled' ? 'youAreSelling' : 'youWereSelling'}`)}
        </Text>
        <View style={tw`flex-row items-center justify-center gap-2`}>
          {!!numberOfOffers && <Text style={tw`h6`}>{numberOfOffers} x</Text>}
          <BTCAmount amount={amount} size="small" />
        </View>
      </SummaryCard.Section>

      <HorizontalLine />

      <SummaryCard.Section>
        <Text style={tw`text-center text-black-2`}>{i18n('offer.summary.withA')}</Text>
        <Text style={[tw`text-center subtitle-1`, getPremiumColor(offer.premium, false)]}>
          <Text style={tw`subtitle-1`}>{Math.abs(premium)}% </Text>
          {i18n(premium >= 0 ? 'offer.summary.premium' : 'offer.summary.discount')}
        </Text>
      </SummaryCard.Section>

      <HorizontalLine />

      <SummaryCard.PaymentMethods meansOfPayment={meansOfPayment} />

      <HorizontalLine />

      <SummaryCard.Section>
        <Text style={tw`text-center text-black-2`}>{i18n('offer.summary.refundWallet')}</Text>
        {walletLabel}
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
}
