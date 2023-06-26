import { FlatList, ListRenderItem } from 'react-native'
import tw from '../../styles/tailwind'
import { EmptyTransactionHistory } from './EmptyTransactionHistory'
import { TxSummaryItem } from './components/TxSummaryItem'
import { useTransactionHistorySetup } from './hooks/useTransactionHistorySetup'

const ListItem: ListRenderItem<TransactionSummary> = ({ item: tx }) => <TxSummaryItem key={tx.id} tx={tx} />

export const TransactionHistory = () => {
  const { transactions, refresh, isRefreshing } = useTransactionHistorySetup()

  if (transactions.length === 0) return <EmptyTransactionHistory />
  return (
    <FlatList
      initialNumToRender={10}
      maxToRenderPerBatch={20}
      contentContainerStyle={[tw`px-4 py-12 gap-4`, tw.md`px-8`]}
      data={transactions}
      renderItem={ListItem}
      onRefresh={refresh}
      refreshing={isRefreshing}
    />
  )
}
