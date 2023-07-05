import { RefreshControl } from 'react-native'
import { PeachScrollView } from '../../components'
import tw from '../../styles/tailwind'
import { BitcoinLoading } from '../loading/BitcoinLoading'
import { TransactionHeader } from './components/transactionDetails/TransactionHeader'
import { TransactionDetailsInfo } from './components/transcactionDetails/TransactionDetailsInfo'
import { useTransactionDetailsSetup } from './hooks/useTransactionDetailsSetup'

export const TransactionDetails = () => {
  const { transaction, refresh, isRefreshing } = useTransactionDetailsSetup()

  if (!transaction) return <BitcoinLoading />

  return (
    <PeachScrollView
      contentContainerStyle={[tw`justify-center flex-grow px-7`, tw`px-8`]}
      contentStyle={tw`gap-8`}
      refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={refresh} />}
    >
      <TransactionHeader style={tw`self-center`} {...transaction} />
      <TransactionDetailsInfo {...{ transaction }} />
    </PeachScrollView>
  )
}
