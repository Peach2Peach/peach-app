import { View } from 'react-native'
import { useContractContext } from '../../views/contract/context'
import { shouldShowTradeStatusInfo } from './shouldShowTradeStatusInfo'
import { TradeDetails } from './TradeDetails'
import { TradeSeparator } from './TradeSeparator'
import { TradeStatusInfo } from './TradeStatusInfo'

export const TradeInformation = () => {
  const { contract, view } = useContractContext()
  return (
    <View>
      <TradeSeparator />
      {shouldShowTradeStatusInfo(contract, view) ? <TradeStatusInfo /> : <TradeDetails />}
    </View>
  )
}
