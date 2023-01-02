import { useQuery } from '@tanstack/react-query'
import React from 'react'
import { View } from 'react-native'
import { Text } from '../../../components'
import tw from '../../../styles/tailwind'
import { account } from '../../../utils/account'
import i18n from '../../../utils/i18n'
import { marketPrices } from '../../../utils/peachAPI/public/market'
import { thousands } from '../../../utils/string'

/**
 *
 *
  export const getTradingLimit = (prices, currency?: Currency): TradingLimit => {
    let exchangeRate = 1
    const tradingLimit = account.tradingLimit || defaultAccount.tradingLimit

    if (currency) exchangeRate = prices[currency]! / prices.CHF!

    return {
      daily: Math.round(tradingLimit.daily * exchangeRate),
      dailyAmount: Math.round(tradingLimit.dailyAmount * exchangeRate * 100) / 100,
      yearly: Math.round(tradingLimit.yearly * exchangeRate),
      yearlyAmount: Math.round(tradingLimit.yearlyAmount * exchangeRate * 100) / 100,
    }
  }
 */

const getMarketPrices = async () => {
  const [data] = await marketPrices({ timeout: undefined })
  return data
}

const useMarketPrices = () => {
  const queryData = useQuery(['bitcoin-market-price'], getMarketPrices, {
    refetchInterval: 1000 * 15,
  })

  return { ...queryData, displayPrice: queryData.data?.[account.settings.displayCurrency] }
}

const Progress = ({ text, percentage, style }: { text?: string; percentage: number } & ComponentProps) => (
  <View style={style}>
    <View style={tw`bg-primary-mild-1 h-2 rounded-full`}>
      {percentage > 0 && (
        <View
          style={[
            tw`bg-primary-main h-[9px] rounded-full border-[1px] border-primary-background`,
            { width: `${percentage}%` },
          ]}
        />
      )}
    </View>
    {!!text && <Text style={tw`self-center body-s mt-1 text-[#816D64]`}>{text}</Text>}
  </View>
)

export const TradingLimits = (props: ComponentProps) => {
  const { displayPrice } = useMarketPrices()
  const { displayCurrency } = account.settings
  const { dailyAmount, daily, yearlyAmount, yearly } = account.tradingLimit
  const monthlyAmount = 0
  const monthly = 1000
  const limits = [
    [dailyAmount, daily],
    [monthlyAmount, monthly],
    [yearlyAmount, yearly],
  ]

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
