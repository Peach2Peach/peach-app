import { View } from 'react-native'
import { Progress } from '../../../components/ui/Progress'
import { useTradingLimits } from '../../../hooks/query/useTradingLimits'
import { useSettingsStore } from '../../../store/settingsStore'
import tw from '../../../styles/tailwind'
import { TradingLimitAmount } from './TradingLimitAmount'

export const TradingLimits = () => {
  const { dailyAmount, daily, monthlyAnonymous, monthlyAnonymousAmount, yearlyAmount, yearly } = useTradingLimits()
  const limits = [
    [dailyAmount, daily],
    [monthlyAnonymousAmount, monthlyAnonymous],
    [yearlyAmount, yearly],
  ]
  const displayCurrency = useSettingsStore((state) => state.displayCurrency)

  return (
    <>
      {limits.map(([amount, limit], index) => (
        <View key={`myProfile-tradingLimits-${index}`}>
          <Progress
            percent={amount / limit >= 0.03 ? amount / limit : 0}
            style={tw`h-[6px]`}
            backgroundStyle={tw`bg-primary-mild-1`}
            barStyle={tw`h-[10px] -mt-[2px] border-2 bg-primary-main border-primary-background-main`}
          />
          <TradingLimitAmount
            style={tw`pl-2 mt-1`}
            type={(['daily', 'monthly', 'yearly'] as const)[index]}
            {...{ amount, limit, displayCurrency }}
          />
        </View>
      ))}
    </>
  )
}
