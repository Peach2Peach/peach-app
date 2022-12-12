import React, { ReactElement, useContext } from 'react'
import { Pressable, View } from 'react-native'
import BitcoinContext from '../../contexts/bitcoin'
import { OverlayContext } from '../../contexts/overlay'
import tw from '../../styles/tailwind'
import i18n from '../../utils/i18n'
import Icon from '../Icon'
import { default as TradingLimitHelp } from '../../overlays/info/TradingLimit'
import { Text } from '../text'
import { Progress } from '../ui'
import { thousands } from '../../utils/string'

type TradingLimitProps = ComponentProps & {
  tradingLimit: TradingLimit
}
export const TradingLimit = ({ tradingLimit, style }: TradingLimitProps): ReactElement => {
  const [bitcoinContext] = useContext(BitcoinContext)
  const [, updateOverlay] = useContext(OverlayContext)
  const { daily, dailyAmount, yearly, yearlyAmount } = tradingLimit

  const openTradingLimitHelp = () => updateOverlay({ content: <TradingLimitHelp />, visible: true })

  return (
    <View style={style}>
      <View style={tw`flex-row justify-center items-center pl-11`}>
        <Text style={tw`text-center text-grey-1 font-bold`}>{i18n('profile.tradingLimits')}</Text>
        <Pressable style={tw`p-3`} onPress={openTradingLimitHelp}>
          <Icon id="helpCircle" style={tw`w-4 h-4`} color={tw`text-blue-1`.color} />
        </Pressable>
      </View>
      <Progress
        style={tw`mt-1 rounded`}
        percent={dailyAmount / daily}
        text={i18n(
          'profile.tradingLimits.daily',
          bitcoinContext.currency,
          thousands(dailyAmount),
          daily === Infinity ? '∞' : thousands(daily),
        )}
      />
      <Progress
        style={tw`mt-1 rounded`}
        percent={yearlyAmount / yearly}
        text={i18n(
          'profile.tradingLimits.yearly.short',
          bitcoinContext.currency,
          thousands(yearlyAmount),
          yearly === Infinity ? '∞' : thousands(yearly),
        )}
      />
    </View>
  )
}

export default TradingLimit
