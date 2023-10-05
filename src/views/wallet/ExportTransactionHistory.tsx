import { TransactionDetails } from 'bdk-rn/lib/classes/Bindings'
import { View } from 'react-native'
import { Header, Screen, Text } from '../../components'
import { NewButton as Button } from '../../components/buttons/Button'
import { useWriteCSV } from '../../hooks'
import tw from '../../styles/tailwind'
import { createCSV } from '../../utils/file'
import i18n from '../../utils/i18n'
import { useWalletState } from '../../utils/wallet/walletStore'
import { getTxSummary } from './helpers/getTxSummary'

export const ExportTransactionHistory = () => {
  const transactions = useWalletState((state) => state.transactions)

  const openShareMenu = useWriteCSV()

  const onPress = async () => {
    const csvValue = createCSVValue(transactions)
    await openShareMenu(csvValue, 'transaction-history.csv')
  }

  return (
    <Screen header={<Header title={i18n('wallet.exportHistory.title')} />}>
      <View style={tw`justify-center gap-8 grow`}>
        <Text style={tw`body-l`}>
          {`${i18n('wallet.exportHistory.description')}
  • ${i18n('wallet.exportHistory.description.point1')}
  • ${i18n('wallet.exportHistory.description.point2')}
  • ${i18n('wallet.exportHistory.description.point3')}
  • ${i18n('wallet.exportHistory.description.point4')}`}
        </Text>
      </View>
      <Button style={tw`self-center`} onPress={onPress}>
        {i18n('wallet.exportHistory.export')}
      </Button>
    </Screen>
  )
}

function createCSVValue (transactions: TransactionDetails[]) {
  const headers = ['Date', 'Type', 'Amount', 'Transaction ID']
  const fields = {
    Date: (d: TransactionDetails) => {
      const { date } = getTxSummary(d)
      return date.toLocaleString().replaceAll(',', '')
    },
    Type: (d: TransactionDetails) => getTxSummary(d).type,
    Amount: (d: TransactionDetails) => getTxSummary(d).amount,
    'Transaction ID': (d: TransactionDetails) => getTxSummary(d).id,
  }

  return createCSV(transactions, headers, fields)
}
