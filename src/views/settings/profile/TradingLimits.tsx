import { useQuery } from '@tanstack/react-query'
import React from 'react'
import { View } from 'react-native'

import { useMarketPrices } from '../../../hooks'
import tw from '../../../styles/tailwind'
import { account } from '../../../utils/account'
import i18n from '../../../utils/i18n'
import { getTradingLimit } from '../../../utils/peachAPI'
import { thousands } from '../../../utils/string'
import { Progress } from './Progress'

const tradingLimitQuery = async () => {
  const [result, err] = await getTradingLimit({})
  if (err) {
    throw new Error(err.error)
  }
  return result
}

const useTradingLimits = () => {
  const limits = useQuery(['tradingLimits'], tradingLimitQuery)
  return limits
}

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

  const { data: marketPrices } = useMarketPrices()
  const displayPrice = marketPrices && marketPrices[displayCurrency]
  const exchangeRate = displayPrice && marketPrices.CHF ? displayPrice / marketPrices.CHF : 1

  return (
    <View {...props}>
      {limits.map(([amount, limit], index) => {
        amount = Math.round(Math.round(amount * exchangeRate * 100) / 100)
        limit = Math.round(exchangeRate * limit)
        return (
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
        )
      })}
    </View>
  )
}
