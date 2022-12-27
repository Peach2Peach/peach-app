import React from 'react'
import { View } from 'react-native'
import { Icon, Text } from '../../../components'
import { SummaryItem } from '../../../components/lists/SummaryItem'
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
      callback: () => {},
      label: 'Action label',
      icon: 'alertCircle',
    },
    color: tw`text-primary-main`.color,
    style: tw`mt-2`,
  }
  return (
    <View style={tw`flex flex-col items-center`}>
      <Text style={tw`h3 mt-4`}>Summary Item</Text>
      <SummaryItem {...defaultSummaryItem} />
      <SummaryItem
        {...{
          ...defaultSummaryItem,
          title: 'with icon',
          icon: <Icon id="upload" style={tw`w-4`} color={tw`text-success-main`.color} />,
        }}
      />
      <SummaryItem {...{ ...defaultSummaryItem, color: tw`text-info-main`.color }} />
      <SummaryItem {...{ ...defaultSummaryItem, color: tw`text-warning-main`.color }} />
      <SummaryItem {...{ ...defaultSummaryItem, title: 'no action', action: { callback: () => {} } }} />
    </View>
  )
}
