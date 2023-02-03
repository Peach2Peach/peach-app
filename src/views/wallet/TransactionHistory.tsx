import React, { useMemo } from 'react'
import { FlatList, ListRenderItem, View } from 'react-native'
import { Text } from '../../components'
import { useHeaderSetup } from '../../hooks'
import tw from '../../styles/tailwind'
import i18n from '../../utils/i18n'
import { TxSummaryItem } from './components/TxSummaryItem'
import { useTransactionHistorySetup } from './hooks/useTransactionHistorySetup'
import PeachOrange from '../../assets/logo/peachOrange.svg'

const ListItem: ListRenderItem<TransactionSummary> = ({ item: tx }) => <TxSummaryItem key={tx.id} tx={tx} />
const Separator = () => <View style={tw`mt-4`} />

export default () => {
  useHeaderSetup(useMemo(() => ({ title: i18n('wallet.transactionHistory') }), []))
  const { transactions } = useTransactionHistorySetup()

  if (transactions.length === 0) return (
    <View style={tw`h-full justify-center items-center`}>
      <PeachOrange style={tw`w-20 h-20`} />
      <Text style={tw`mt-8 subtitle-1 text-black-2`}>{i18n('wallet.transactionHistory.empty')}</Text>
    </View>
  )
  return <FlatList style={tw`px-8 pt-12`} data={transactions} renderItem={ListItem} ItemSeparatorComponent={Separator} />
}
