import React, { useMemo } from 'react'
import { FlatList, ListRenderItem, View } from 'react-native'
import { useHeaderSetup } from '../../hooks'
import tw from '../../styles/tailwind'
import i18n from '../../utils/i18n'
import { TxSummaryItem } from './components/TxSummaryItem'
import { useTransactionHistorySetup } from './hooks/useTransactionHistorySetup'

const ListItem: ListRenderItem<TransactionSummary> = ({ item: tx }) => <TxSummaryItem key={tx.id} tx={tx} />
const Separator = () => <View style={tw`mt-4`} />

export default () => {
  useHeaderSetup(useMemo(() => ({ title: i18n('wallet.transactionHistory') }), []))
  const { transactions } = useTransactionHistorySetup()

  return <FlatList style={tw`px-8 pt-12`} data={transactions} renderItem={ListItem} ItemSeparatorComponent={Separator} />
}
