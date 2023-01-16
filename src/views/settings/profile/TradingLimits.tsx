import React from 'react'
import { View } from 'react-native'

import { Progress, Text } from '../../../components'
import tw from '../../../styles/tailwind'
import { account } from '../../../utils/account'
import i18n from '../../../utils/i18n'
import { getExchangeRate } from '../../../utils/market'
import { priceFormat } from '../../../utils/string'

export const TradingLimits = (props: ComponentProps) => {
  const { dailyAmount, daily, yearlyAmount, yearly } = account.tradingLimit
  const { displayCurrency } = account.settings
  const monthlyAmount = 0
  const monthly = 1000
  const limits = [
    [dailyAmount, daily],
    [monthlyAmount, monthly],
    [yearlyAmount, yearly],
  ]
  const exchangeRate = getExchangeRate(displayCurrency, 'CHF')

  return (
    <View {...props}>
      {limits.map(([amount, limit], index) => {
        amount = Math.round(amount * exchangeRate * 100) / 100
        limit = Math.round(exchangeRate * limit)
        return (
          <View style={tw`mb-4`}>
            <Progress
              key={`myProfile-tradingLimits-${index}`}
              percent={amount / limit}
              style={tw`h-[6px]`}
              backgroundStyle={tw`bg-primary-background-dark`}
              barStyle={tw`h-[10px] -mt-[2px] border-2 bg-primary-main border-primary-background-light`}
            />
            <Text style={tw`self-center mt-1 body-s text-black-2`}>
              {i18n(
                'profile.tradingLimits.' + ['daily', 'monthly', 'yearly'][index],
                displayCurrency,
                priceFormat(amount),
                priceFormat(limit),
              )}
            </Text>
          </View>
        )
      })}
    </View>
  )
}
