import React from 'react'
import { View } from 'react-native'

import tw from '../../../styles/tailwind'
import { account } from '../../../utils/account'
import { useTradingLimits } from '../../../hooks'
import { Progress } from '../../../components'
import { TradingLimitAmount } from './TradingLimitAmount'

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
            percent={amount / limit >= 0.03 ? amount / limit : 0}
            style={tw`h-[6px]`}
            backgroundStyle={tw`bg-primary-mild-1`}
            barStyle={tw`h-[10px] -mt-[2px] border-2 bg-primary-main border-primary-background`}
          />
          <TradingLimitAmount
            style={tw`pl-2 mt-1`}
            type={(['daily', 'monthly', 'yearly'] as const)[index]}
            {...{ amount, limit, displayCurrency }}
          />
        </View>
      ))}
    </View>
  )
}
