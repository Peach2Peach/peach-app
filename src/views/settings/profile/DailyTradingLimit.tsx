import { View } from 'react-native'

import { Progress } from '../../../components'
import tw from '../../../styles/tailwind'
import { useTradingLimits } from '../../../hooks'
import { TradingLimitAmount } from './TradingLimitAmount'
import { useSettingsStore } from '../../../store/settingsStore'

export const DailyTradingLimit = (props: ComponentProps) => {
  const {
    limits: { dailyAmount: amount, daily: limit },
  } = useTradingLimits()
  const displayCurrency = useSettingsStore((state) => state.displayCurrency)

  return (
    <View {...props}>
      <TradingLimitAmount {...{ amount, limit, displayCurrency }} style={tw`self-center mt-1`} type="daily" />
      <Progress
        style={tw`h-1 rounded-none`}
        percent={amount / limit}
        backgroundStyle={tw`rounded-none bg-primary-mild-1`}
        barStyle={tw`h-1 border-r-2 rounded-none bg-primary-main border-primary-background-light`}
      />
    </View>
  )
}
