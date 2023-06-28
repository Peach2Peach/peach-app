import { FlatList } from 'react-native'
import tw from '../../styles/tailwind'
import { EmptyTransactionHistory } from './EmptyTransactionHistory'
import { TxStatusCard } from './components/TxStatusCard'
import { useTransactionHistorySetup } from './hooks/useTransactionHistorySetup'

export const TransactionHistory = () => {
  const { transactions, refresh, isRefreshing } = useTransactionHistorySetup()

  if (transactions.length === 0) return <EmptyTransactionHistory />
  return (
    <FlatList
      initialNumToRender={10}
      maxToRenderPerBatch={20}
      contentContainerStyle={[tw`gap-4 p-4`, tw.md`p-8`]}
      data={transactions}
      renderItem={TxStatusCard}
      keyExtractor={(item) => item.id}
      onRefresh={refresh}
      refreshing={isRefreshing}
    />
  )
}
