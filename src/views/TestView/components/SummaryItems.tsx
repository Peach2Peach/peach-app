import { View } from 'react-native'
import { Text } from '../../../components'
import tw from '../../../styles/tailwind'
import { SummaryItem, TextSummaryItem } from '../../../components/summaryItem'
import { info } from '../../../utils/log'
import { ConfirmationSummaryItem } from '../../../components/summaryItem/ConfirmationSummaryItem'
import { AmountSummaryItem } from '../../../components/summaryItem/AmountSummaryItem'

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
  </View>
)
