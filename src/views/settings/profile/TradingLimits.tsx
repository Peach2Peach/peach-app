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

const defaultLimits = {
  daily: 1000,
  dailyAmount: 0,
  yearly: 100000,
  yearlyAmount: 0,
}

const useTradingLimits = () => {
  const { data: limits } = useQuery(['tradingLimits'], tradingLimitQuery)
  const { data: marketPrices } = useMarketPrices()

  const { displayCurrency } = account.settings
  const displayPrice = marketPrices && marketPrices[displayCurrency]
  const exchangeRate = displayPrice && marketPrices.CHF ? displayPrice / marketPrices.CHF : 1

  const roundedDisplayLimits = limits
    ? {
      dailyAmount: Math.round(Math.round(limits.dailyAmount * exchangeRate * 100) / 100),
      daily: Math.round(exchangeRate * limits.daily),
      monthlyAmount: Math.round(Math.round(limits.monthlyAmount * exchangeRate * 100) / 100),
      monthly: Math.round(exchangeRate * limits.monthly),
      yearlyAmount: Math.round(Math.round(limits.yearlyAmount * exchangeRate * 100) / 100),
      yearly: Math.round(exchangeRate * limits.yearly),
    }
    : defaultLimits

  return { limits: roundedDisplayLimits }
}

export const TradingLimits = (props: ComponentProps) => {
  const {
    limits: { dailyAmount, daily, monthlyAmount, monthly, yearlyAmount, yearly },
  } = useTradingLimits()
  const limits = [
    [dailyAmount, daily],
    [monthlyAmount, monthly],
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
