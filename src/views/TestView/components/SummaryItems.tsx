import { Alert, View } from 'react-native'
import { Icon, Text } from '../../../components'
import { SummaryItem } from '../../../components/lists/SummaryItem'
import { MSINADAY } from '../../../constants'
import tw from '../../../styles/tailwind'

export const SummaryItems = () => {
  const defaultSummaryItem = {
    title: 'trade 1',
    icon: undefined,
    amount: 615000,
    currency: 'EUR' as Currency,
    price: 133.7,
    date: new Date(),
    action: {
      callback: () => Alert.alert('Action works'),
      label: 'action label',
      icon: 'alertCircle',
    },
    level: 'APP' as Level,
    style: tw`mt-2`,
  }
  return (
    <View style={tw`flex flex-col items-center`}>
      <Text style={tw`mt-4 h3`}>Summary Item</Text>
      <SummaryItem {...defaultSummaryItem} />
      <SummaryItem
        {...{
          ...defaultSummaryItem,
          date: new Date(Date.now() - MSINADAY),
          title: 'with icon',
          icon: <Icon id="upload" style={tw`w-4`} color={tw`text-success-main`.color} />,
        }}
      />
      <SummaryItem {...{ ...defaultSummaryItem, date: new Date(Date.now() - 2 * MSINADAY), level: 'INFO' }} />
      <SummaryItem {...{ ...defaultSummaryItem, level: 'WARN' }} />
      <SummaryItem {...{ ...defaultSummaryItem, title: 'no action', action: { callback: () => {} } }} />
    </View>
  )
}
