import React, { ReactElement, useContext } from 'react'
import { View } from 'react-native'
import BitcoinContext from '../../contexts/bitcoin'
import tw from '../../styles/tailwind'
import i18n from '../../utils/i18n'
import { Text } from '../text'
import { Progress } from '../ui'

type TradingLimitProps = ComponentProps & {
  tradingLimit: TradingLimit,
}
export const TradingLimit = ({ tradingLimit, style }: TradingLimitProps): ReactElement => {
  const [bitcoinContext] = useContext(BitcoinContext)
  const { daily, dailyAmount, yearly, yearlyAmount } = tradingLimit
  return <View style={style}>
    <Text style={tw`text-center text-grey-1 font-bold`}>
      {i18n('profile.tradingLimits')}
    </Text>
    <Progress
      style={tw`rounded`}
      percent={dailyAmount / daily}
      text={i18n(
        'profile.tradingLimits.daily',
        bitcoinContext.currency, String(dailyAmount), String(daily === Infinity ? '∞' : daily)
      )}
    />
    <Progress
      style={tw`mt-1 rounded`}
      percent={yearlyAmount / yearly}
      text={i18n(
        'profile.tradingLimits.yearly',
        bitcoinContext.currency, String(yearlyAmount), String(yearly === Infinity ? '∞' : yearly)
      )}
    />
  </View>
}

export default TradingLimit