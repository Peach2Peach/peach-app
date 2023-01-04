import React from 'react'
import { View } from 'react-native'
import { Text } from '../../../components'
import tw from '../../../styles/tailwind'
import { account } from '../../../utils/account'
import i18n from '../../../utils/i18n'
import { thousands } from '../../../utils/string'

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
            'CHF',
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
