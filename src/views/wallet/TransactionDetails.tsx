import { RefreshControl } from 'react-native'
import { PeachScrollView, Screen } from '../../components'
import tw from '../../styles/tailwind'
import i18n from '../../utils/i18n'
import { BitcoinLoading } from '../loading/BitcoinLoading'
import { TransactionHeader } from './components/transactionDetails/TransactionHeader'
import { TransactionDetailsInfo } from './components/transcactionDetails/TransactionDetailsInfo'
import { useTransactionDetailsSetup } from './hooks/useTransactionDetailsSetup'

export const TransactionDetails = () => {
  const { transaction, refresh, isRefreshing } = useTransactionDetailsSetup()

  if (!transaction) return <BitcoinLoading />

  return (
    <Screen header={i18n('wallet.transactionDetails')}>
      <PeachScrollView
        contentContainerStyle={tw`justify-center grow`}
        contentStyle={tw`gap-8`}
        refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={refresh} />}
      >
        <TransactionHeader style={tw`self-center`} {...transaction} />
        <TransactionDetailsInfo {...{ transaction }} />
      </PeachScrollView>
    </Screen>
  )
}
