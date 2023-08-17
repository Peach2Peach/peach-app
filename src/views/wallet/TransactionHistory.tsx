import { FlatList } from 'react-native'
import tw from '../../styles/tailwind'
import { EmptyTransactionHistory, TxStatusCard } from './components'
import { useTransactionHistorySetup } from './hooks'

export const TransactionHistory = () => {
  const { transactions, refresh, isRefreshing } = useTransactionHistorySetup()

  if (transactions.length === 0) return <EmptyTransactionHistory />
  return (
    <FlatList
      initialNumToRender={10}
      maxToRenderPerBatch={20}
      contentContainerStyle={[tw`gap-4 p-4`, tw.md`p-8`]}
      data={transactions}
      renderItem={(props) => <TxStatusCard {...props} />}
      keyExtractor={(item) => item.id}
      onRefresh={refresh}
      refreshing={isRefreshing}
    />
  )
}
