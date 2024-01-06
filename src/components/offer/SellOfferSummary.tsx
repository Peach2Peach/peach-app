import { View } from 'react-native'
import tw from '../../styles/tailwind'
import i18n from '../../utils/i18n'
import { BTCAmount } from '../bitcoin/btcAmount/BTCAmount'
import { EscrowLink } from '../matches/components/EscrowLink'
import { getPremiumColor } from '../matches/utils/getPremiumColor'
import { PeachText } from '../text/PeachText'
import { HorizontalLine } from '../ui/HorizontalLine'
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
        <PeachText style={tw`text-center text-black-65`}>
          {i18n(`offer.summary.${tradeStatus !== 'offerCanceled' ? 'youAreSelling' : 'youWereSelling'}`)}
        </PeachText>
        <View style={tw`flex-row items-center justify-center gap-2`}>
          {!!numberOfOffers && <PeachText style={tw`h6`}>{numberOfOffers} x</PeachText>}
          <BTCAmount amount={amount} size="small" />
        </View>
      </SummaryCard.Section>

      <HorizontalLine />

      <SummaryCard.Section>
        <PeachText style={tw`text-center text-black-65`}>{i18n('offer.summary.withA')}</PeachText>
        <PeachText style={[tw`text-center subtitle-1`, getPremiumColor(offer.premium, false)]}>
          <PeachText style={tw`subtitle-1`}>{Math.abs(premium)}% </PeachText>
          {i18n(premium >= 0 ? 'offer.summary.premium' : 'offer.summary.discount')}
        </PeachText>
      </SummaryCard.Section>

      <HorizontalLine />

      <SummaryCard.PaymentMethods meansOfPayment={meansOfPayment} />

      <HorizontalLine />

      <SummaryCard.Section>
        <PeachText style={tw`text-center text-black-65`}>{i18n('offer.summary.refundWallet')}</PeachText>
        {walletLabel}
      </SummaryCard.Section>

      {isSellOfferWithDefinedEscrow(offer) && (
        <>
          <HorizontalLine />

          <SummaryCard.Section>
            <EscrowLink address={offer.escrow} />
          </SummaryCard.Section>
        </>
      )}
    </SummaryCard>
  )
}
