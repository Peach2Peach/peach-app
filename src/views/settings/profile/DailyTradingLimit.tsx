import React from 'react'
import { View } from 'react-native'

import { Progress, Text } from '../../../components'
import { useExchangeRate } from '../../../hooks'
import tw from '../../../styles/tailwind'
import { account } from '../../../utils/account'
import i18n from '../../../utils/i18n'
import { priceFormat, thousands } from '../../../utils/string'

export const DailyTradingLimit = (props: ComponentProps) => {
  const { dailyAmount, daily } = account.tradingLimit
  const { displayCurrency } = account.settings
  const exchangeRate = useExchangeRate(displayCurrency, 'CHF')
  const amount = Math.round(dailyAmount * exchangeRate * 100) / 100
  const limit = Math.round(exchangeRate * daily)

  return (
    <View {...props}>
      <Text style={tw`self-center mt-1 body-s text-black-2`}>
        {i18n('profile.tradingLimits.daily', displayCurrency, priceFormat(amount), thousands(limit))}
      </Text>
      <Progress
        style={tw`h-1 rounded-none`}
        percent={amount / limit}
        backgroundStyle={tw`rounded-none bg-primary-background-dark`}
        barStyle={tw`h-1 border-r-2 rounded-none bg-primary-main border-primary-background-light`}
      />
    </View>
  )
}
