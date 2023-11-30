import { FlatList } from 'react-native'
import { Header, Screen } from '../../components'
import { useNavigation } from '../../hooks'
import tw from '../../styles/tailwind'
import i18n from '../../utils/i18n'
import { headerIcons } from '../../utils/layout'
import { EmptyTransactionHistory, TxStatusCard } from './components'
import { useTransactionHistorySetup } from './hooks'

export const TransactionHistory = () => {
  const { transactions, refresh, isRefreshing } = useTransactionHistorySetup()

  return (
    <Screen header={<TransactionHistoryHeader />}>
      {transactions.length === 0 ? (
        <EmptyTransactionHistory />
      ) : (
        <FlatList
          initialNumToRender={10}
          maxToRenderPerBatch={20}
          contentContainerStyle={[tw`gap-4 py-sm`, tw`md:py-md`]}
          data={transactions}
          renderItem={(props) => <TxStatusCard {...props} />}
          keyExtractor={(item) => item.id}
          onRefresh={refresh}
          refreshing={isRefreshing}
        />
      )}
    </Screen>
  )
}

function TransactionHistoryHeader () {
  const navigation = useNavigation()
  const onPress = () => {
    navigation.navigate('exportTransactionHistory')
  }
  return (
    <Header
      title={i18n('wallet.transactionHistory')}
      icons={[
        {
          ...headerIcons.share,
          onPress,
          accessibilityHint: `${i18n('goTo')} ${i18n('wallet.exportHistory.title')}`,
        },
      ]}
    />
  )
}
