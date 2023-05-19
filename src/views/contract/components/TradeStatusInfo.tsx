import { View } from 'react-native'
import tw from '../../../styles/tailwind'
import { SummaryItem } from '../../../components/payment/paymentDetailTemplates/SummaryItem'
import { Text } from '../../../components/text'
import { getTradeActionStatus, getTradeActionStatusText } from '../helpers'
import { useContractContext } from '../context'

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
