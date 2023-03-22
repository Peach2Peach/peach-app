import React, { useMemo } from 'react'
import { FlatList, Image, ListRenderItem, View } from 'react-native'
import loadingAnimation from '../../assets/animated/logo-rotate.gif'
import { Text } from '../../components'
import { useHeaderSetup } from '../../hooks'
import tw from '../../styles/tailwind'
import i18n from '../../utils/i18n'
import { TxSummaryItem } from './components/TxSummaryItem'
import { useTransactionHistorySetup } from './hooks/useTransactionHistorySetup'

const ListItem: ListRenderItem<TransactionSummary> = ({ item: tx }) => <TxSummaryItem key={tx.id} tx={tx} />
const Separator = () => <View style={tw`mt-4`} />

export default () => {
  useHeaderSetup(useMemo(() => ({ title: i18n('wallet.transactionHistory') }), []))
  const { transactions, refresh, refreshing } = useTransactionHistorySetup()

  if (transactions.length === 0) return (
    <View style={tw`items-center justify-center h-full`}>
      <Image source={loadingAnimation} style={tw`w-30 h-30`} resizeMode="contain" />

      <Text style={tw`mt-8 subtitle-1 text-black-2`}>{i18n('wallet.transactionHistory.empty')}</Text>
    </View>
  )
  return (
    <FlatList
      contentContainerStyle={tw`px-8 py-12`}
      data={transactions}
      renderItem={ListItem}
      ItemSeparatorComponent={Separator}
      onRefresh={refresh}
      refreshing={refreshing}
    />
  )
}
