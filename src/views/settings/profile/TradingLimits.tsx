import React from 'react'
import { View } from 'react-native'

import tw from '../../../styles/tailwind'
import { account } from '../../../utils/account'
import i18n from '../../../utils/i18n'
import { thousands } from '../../../utils/string'
import { useTradingLimits } from './useTradingLimits'
import { Progress, Text } from '../../../components'

export const TradingLimits = (props: ComponentProps) => {
  const {
    limits: { dailyAmount, daily, monthlyAnonymous, monthlyAnonymousAmount, yearlyAmount, yearly },
  } = useTradingLimits()
  const limits = [
    [dailyAmount, daily],
    [monthlyAnonymousAmount, monthlyAnonymous],
    [yearlyAmount, yearly],
  ]
  const { displayCurrency } = account.settings

  return (
    <View {...props}>
      {limits.map(([amount, limit], index) => (
        <View style={tw`mb-4`} key={`myProfile-tradingLimits-${index}`}>
          <Progress
            percent={amount / limit}
            style={tw`h-[6px]`}
            backgroundStyle={tw`bg-primary-background-dark`}
            barStyle={tw`h-[10px] -mt-[2px] border-2 bg-primary-main border-primary-background-light`}
          />
          <Text style={tw`self-center mt-1 body-s text-black-2`}>
            {i18n(
              'profile.tradingLimits.' + ['daily', 'monthly', 'yearly'][index],
              displayCurrency,
              thousands(amount),
              thousands(limit),
            )}
          </Text>
        </View>
      ))}
    </View>
  )
}
