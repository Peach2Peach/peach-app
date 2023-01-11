import React, { ReactElement } from 'react'
import { Pressable, View } from 'react-native'
import shallow from 'zustand/shallow'
import { useShowHelp } from '../../hooks/useShowHelp'
import { useBitcoinStore } from '../../store/bitcoinStore'
import tw from '../../styles/tailwind'
import i18n from '../../utils/i18n'
import { thousands } from '../../utils/string'
import Icon from '../Icon'
import { Text } from '../text'
import { Progress } from '../ui'

type TradingLimitProps = ComponentProps & {
  tradingLimit: TradingLimit
}
export const TradingLimit = ({ tradingLimit, style }: TradingLimitProps): ReactElement => {
  const [currency] = useBitcoinStore((state) => [state.currency], shallow)
  const { daily, dailyAmount, yearly, yearlyAmount } = tradingLimit
  const openTradingLimitHelp = useShowHelp('tradingLimit')

  return (
    <View style={style}>
      <View style={tw`flex-row items-center justify-center pl-11`}>
        <Text style={tw`font-bold text-center text-grey-1`}>{i18n('profile.tradingLimits')}</Text>
        <Pressable style={tw`p-3`} onPress={openTradingLimitHelp}>
          <Icon id="helpCircle" style={tw`w-4 h-4`} color={tw`text-blue-1`.color} />
        </Pressable>
      </View>
      <Progress
        style={tw`mt-1 rounded`}
        color={tw`bg-primary-main`}
        percent={dailyAmount / daily}
        text={i18n(
          'profile.tradingLimits.daily',
          currency,
          thousands(dailyAmount),
          daily === Infinity ? '∞' : thousands(daily),
        )}
      />
      <Progress
        style={tw`mt-1 rounded`}
        percent={yearlyAmount / yearly}
        color={tw`bg-primary-main`}
        text={i18n(
          'profile.tradingLimits.yearly.short',
          currency,
          thousands(yearlyAmount),
          yearly === Infinity ? '∞' : thousands(yearly),
        )}
      />
    </View>
  )
}

export default TradingLimit
