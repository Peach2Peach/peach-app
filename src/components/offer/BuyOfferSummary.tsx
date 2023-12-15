import { View } from 'react-native'
import tw from '../../styles/tailwind'
import i18n from '../../utils/i18n'
import { BTCAmount } from '../bitcoin/btcAmount/BTCAmount'
import { FixedHeightText } from '../text/FixedHeightText'
import { PeachText } from '../text/PeachText'
import { HorizontalLine } from '../ui/HorizontalLine'
import { SummaryCard } from './SummaryCard'
import { useWalletLabel } from './useWalletLabel'

type Props = {
  offer: BuyOffer
}

export const BuyOfferSummary = ({ offer }: Props) => {
  const walletLabel = useWalletLabel({ label: offer.walletLabel, address: offer.releaseAddress })
  return (
    <SummaryCard>
      <SummaryCard.Section>
        <PeachText style={tw`text-center text-black-2`}>{i18n('offer.summary.youAreBuying')}</PeachText>

        <View style={tw`gap-2`}>
          <BTCAmount size="small" amount={offer.amount[0]} />
          <FixedHeightText height={10} style={tw`text-center text-black-2`}>
            &
          </FixedHeightText>
          <BTCAmount size="small" amount={offer.amount[1]} />
        </View>
      </SummaryCard.Section>

      <HorizontalLine />

      <SummaryCard.PaymentMethods meansOfPayment={offer.meansOfPayment} />

      <HorizontalLine />

      <SummaryCard.Section>
        <PeachText style={tw`text-center text-black-2`}>{i18n('to')}</PeachText>
        <PeachText style={tw`text-center subtitle-1`}>{walletLabel}</PeachText>
      </SummaryCard.Section>
    </SummaryCard>
  )
}
