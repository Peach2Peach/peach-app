import React from 'react'
import { View } from 'react-native'

import tw from '../../../styles/tailwind'
import { account } from '../../../utils/account'
import i18n from '../../../utils/i18n'
import { thousands } from '../../../utils/string'
import { Progress } from './Progress'
import { useTradingLimits } from './useTradingLimits'

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
        <Progress
          key={`myProfile-tradingLimits-${index}`}
          text={i18n(
            'profile.tradingLimits.' + ['daily', 'monthly', 'yearly'][index],
            displayCurrency,
            thousands(amount),
            thousands(limit),
          )}
          style={tw`mb-4`}
          percentage={amount / limit}
        />
      ))}
    </View>
  )
}
