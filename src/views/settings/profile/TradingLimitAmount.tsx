import React from 'react'
import { View } from 'react-native'
import { Text } from '../../../components'
import tw from '../../../styles/tailwind'
import i18n from '../../../utils/i18n'
import { thousands } from '../../../utils/string'

type Props = ComponentProps & {
  amount: number
  limit: number
  displayCurrency: string
  type: 'daily' | 'monthly' | 'yearly'
}
export const TradingLimitAmount = ({ amount, limit, displayCurrency, style, type }: Props) => (
  <View style={style}>
    <Text style={tw`tooltip text-black-2`}>
      {i18n(`profile.tradingLimits.${type}`)}
      {'  '}
      <Text style={tw`font-bold tooltip text-primary-main`}>
        {i18n(`currency.format.${displayCurrency}`, thousands(amount))}
      </Text>
      <Text style={tw`font-bold tooltip text-black-2`}> / </Text>
      <Text style={tw`font-bold tooltip text-primary-mild-1`}>
        {i18n(`currency.format.${displayCurrency}`, thousands(limit))}
      </Text>
    </Text>
  </View>
)
