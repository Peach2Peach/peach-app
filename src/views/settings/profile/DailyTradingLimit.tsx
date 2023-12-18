import { View } from 'react-native'
import { Progress } from '../../../components/ui/Progress'
import { useTradingLimits } from '../../../hooks'
import { useSettingsStore } from '../../../store/settingsStore'
import tw from '../../../styles/tailwind'
import { TradingLimitAmount } from './TradingLimitAmount'

export const DailyTradingLimit = () => {
  const { dailyAmount: amount, daily: limit } = useTradingLimits()
  const displayCurrency = useSettingsStore((state) => state.displayCurrency)

  return (
    <View>
      <TradingLimitAmount {...{ amount, limit, displayCurrency }} style={tw`self-center`} type="daily" />
      <Progress
        style={tw`h-1 rounded-none`}
        percent={amount / limit}
        backgroundStyle={tw`rounded-none bg-primary-mild-1`}
        barStyle={tw`h-1 border-r-2 rounded-none bg-primary-main border-primary-background-light`}
      />
    </View>
  )
}
