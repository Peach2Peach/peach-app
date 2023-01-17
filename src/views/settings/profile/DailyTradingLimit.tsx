import React from 'react'
import { View } from 'react-native'

import { Progress, Text } from '../../../components'
import tw from '../../../styles/tailwind'
import { account } from '../../../utils/account'
import i18n from '../../../utils/i18n'
import { thousands } from '../../../utils/string'
import { useTradingLimits } from '../../../hooks'

export const DailyTradingLimit = (props: ComponentProps) => {
  const {
    limits: { dailyAmount: amount, daily: limit },
  } = useTradingLimits()
  const { displayCurrency } = account.settings

  return (
    <View {...props}>
      <Text style={tw`self-center mt-1 body-s text-black-2`}>
        {i18n('profile.tradingLimits.daily', displayCurrency, thousands(amount), thousands(limit))}
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
