import { FlatList, ListRenderItem, View } from 'react-native'
import tw from '../../styles/tailwind'
import { TxSummaryItem } from './components/TxSummaryItem'
import { useTransactionHistorySetup } from './hooks/useTransactionHistorySetup'
import { EmptyTransactionHistory } from './EmptyTransactionHistory'

const ListItem: ListRenderItem<TransactionSummary> = ({ item: tx }) => <TxSummaryItem key={tx.id} tx={tx} />
const Separator = () => <View style={tw`mt-4`} />

export const TransactionHistory = () => {
  const { transactions, refresh, isRefreshing } = useTransactionHistorySetup()

  if (transactions.length === 0) return <EmptyTransactionHistory />
  return (
    <FlatList
      contentContainerStyle={[tw`px-4 py-12`, tw.md`px-8`]}
      data={transactions}
      renderItem={ListItem}
      ItemSeparatorComponent={Separator}
      onRefresh={refresh}
      refreshing={isRefreshing}
    />
  )
}
