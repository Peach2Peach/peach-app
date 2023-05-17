import { View } from 'react-native'
import tw from '../../styles/tailwind'
import { SummaryItem } from '../payment/paymentDetailTemplates/SummaryItem'
import { Text } from '../text'
import { getTradeActionStatusText } from './getTradeActionStatusText'
import { getTradeActionStatus } from './getTradeActionStatus'
import { useContractContext } from '../../views/contract/context'

export const TradeStatusInfo = () => {
  const { contract, view } = useContractContext()
  return (
    <View>
      <SummaryItem isBitcoinAmount information={contract.amount} />
      <SummaryItem label="status" information={getTradeActionStatus(contract, view)} />
      <Text style={[tw`body-s`, tw.md`body-m`]}>{getTradeActionStatusText(contract, view)}</Text>
    </View>
  )
}
