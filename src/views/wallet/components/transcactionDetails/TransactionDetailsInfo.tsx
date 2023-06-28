import { View } from 'react-native'
import { HorizontalLine, MediumSatsFormat, Text } from '../../../../components'
import { ShortBitcoinAddress } from '../../../../components/bitcoin'
import tw from '../../../../styles/tailwind'
import { toDateFormat } from '../../../../utils/date'
import i18n from '../../../../utils/i18n'
import { TransactionETA } from './TransactionETA'

type Props = {
  transaction: TransactionSummary
  receivingAddress?: string
}
export const TransactionDetailsInfo = ({ transaction, receivingAddress }: Props) => (
  <View>
    <Text style={tw`text-center text-black-2`}>{i18n('date')}</Text>
    <Text style={tw`text-center subtitle-1`}>
      {transaction.confirmed ? toDateFormat(transaction.date) : i18n('wallet.transaction.pending')}
    </Text>
    {!transaction.confirmed && <TransactionETA txId={transaction.id} />}
    <HorizontalLine style={tw`my-4`} />
    <Text style={tw`text-center text-black-2`}>{i18n('to')}</Text>
    <ShortBitcoinAddress
      style={tw`text-center subtitle-1`}
      {...{ address: receivingAddress || '' }}
    ></ShortBitcoinAddress>
    <HorizontalLine style={tw`my-4`} />
    <Text style={tw`text-center text-black-2`}>{i18n('amount')}</Text>
    <View style={tw`flex flex-row justify-center`}>
      <MediumSatsFormat {...{ sats: transaction.amount }} />
    </View>
  </View>
)
