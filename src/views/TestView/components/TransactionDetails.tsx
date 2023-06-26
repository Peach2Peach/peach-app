import { View } from 'react-native'
import { Text } from '../../../components'
import tw from '../../../styles/tailwind'
import { TransactionHeader } from '../../wallet/components/transactionDetails/TransactionHeader'

export const TransactionDetails = () => (
  <View style={tw`flex flex-col items-center`}>
    <Text style={tw`h4`}>Transaction Header</Text>
    <TransactionHeader type="TRADE" contractId="123-456" />
    <TransactionHeader type="DEPOSIT" />
    <TransactionHeader type="ESCROWFUNDED" offerId="123" />
    <TransactionHeader type="ESCROWFUNDED" contractId="123-456" />
    <TransactionHeader type="WITHDRAWAL" />
    <TransactionHeader type="REFUND" contractId="123-456" />
  </View>
)
