import { View } from 'react-native'
import { Text } from '../../../components'
import tw from '../../../styles/tailwind'
import { SummaryItem, TextSummaryItem } from '../../../components/summaryItem'
import { info } from '../../../utils/log'
import { ConfirmationSummaryItem } from '../../../components/summaryItem/ConfirmationSummaryItem'
import { AmountSummaryItem } from '../../../components/summaryItem/AmountSummaryItem'
import { PaymentMethodSummaryItem } from '../../../components/summaryItem/PaymentMethodSummaryItem'
import { AddressSummaryItem } from '../../../components/summaryItem/AddressSummaryItem'
import { RatingSummaryItem } from '../../../components/summaryItem/RatingSummaryItem'
import { PeachIdSummaryItem } from '../../../components/summaryItem/PeachIdSummaryItem'

export const SummaryItems = () => (
  <View style={tw`gap-4`}>
    <Text style={tw`h4 text-center`}>Summary items</Text>
    <SummaryItem title="$title">
      <Text>arbitrary component</Text>
    </SummaryItem>
    <TextSummaryItem title="text summary" text="text" />
    <TextSummaryItem title="text summary" text="icon" iconId="buy" />
    <TextSummaryItem title="text summary" text="icon with very very super long label" iconId="buy" />
    <TextSummaryItem title="text summary" text="icon color" iconId="sell" iconColor={tw`text-primary-main`.color} />
    <TextSummaryItem
      title="text summary"
      text="with action"
      iconId="copy"
      iconColor={tw`text-primary-main`.color}
      onPress={() => info('rick rolled!')}
    />
    <ConfirmationSummaryItem />
    <ConfirmationSummaryItem confirmed />
    <AmountSummaryItem amount={12345} />
    <PaymentMethodSummaryItem title="payment method" paymentMethod="sepa" />
    <PaymentMethodSummaryItem title="clickable payment method" paymentMethod="revolut" />
    <PeachIdSummaryItem title="user" id="0213583209ada26c16e5c3157d86809f8fd46e602936a4e3d51cd988a42ebe19f3" />
    <AddressSummaryItem title="to" address="bcrt1q70z7vw93cxs6jx7nav9cmcn5qvlv362qfudnqmz9fnk2hjvz5nus4c0fuh" />
    <RatingSummaryItem title="rating" rating={1} />
    <RatingSummaryItem title="rating" rating={-1} />
  </View>
)
