import React from 'react'
import { View } from 'react-native'

import { Text } from '../../../components'
import { useMarketPrices } from '../../../hooks'
import tw from '../../../styles/tailwind'
import { account } from '../../../utils/account'
import i18n from '../../../utils/i18n'
import { priceFormat, thousands } from '../../../utils/string'

const Progress = ({ text, percentage, style }: { text?: string; percentage: number } & ComponentProps) => (
  <View style={style}>
    <View style={tw`h-2 overflow-hidden rounded-full bg-primary-background-dark`}>
      {percentage > 0 && (
        <View
          style={[
            tw`bg-primary-main h-[9px] rounded-full border border-primary-background`,
            { width: `${percentage * 100}%` },
          ]}
        />
      )}
    </View>
    {!!text && <Text style={tw`self-center mt-1 body-s text-black-2`}>{text}</Text>}
  </View>
)

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
        amount = Math.round(amount * exchangeRate * 100) / 100
        limit = Math.round(exchangeRate * limit)
        return (
          <Progress
            key={`myProfile-tradingLimits-${index}`}
            text={i18n(
              'profile.tradingLimits.' + ['daily', 'monthly', 'yearly'][index],
              displayCurrency,
              priceFormat(amount),
              priceFormat(limit),
            )}
            style={tw`mb-4`}
            percentage={amount / limit}
          />
        )
      })}
    </View>
  )
}
