import React from 'react'
import { View } from 'react-native'
import { PriceFormat, Text } from '../../../components'
import tw from '../../../styles/tailwind'
import i18n from '../../../utils/i18n'

type Props = ComponentProps & {
  amount: number
  limit: number
  displayCurrency: Currency
  type: 'daily' | 'monthly' | 'yearly'
}
export const TradingLimitAmount = ({ amount, limit, displayCurrency, style, type }: Props) => (
  <View style={style}>
    <Text style={tw`tooltip text-black-2`}>
      {i18n(`profile.tradingLimits.${type}`)}
      {'  '}
      <PriceFormat style={tw`font-bold tooltip text-primary-main`} currency={displayCurrency} amount={amount} round />
      <Text style={tw`font-bold tooltip text-black-2`}> / </Text>
      <PriceFormat style={tw`font-bold tooltip text-primary-mild-1`} currency={displayCurrency} amount={limit} round />
    </Text>
  </View>
)
