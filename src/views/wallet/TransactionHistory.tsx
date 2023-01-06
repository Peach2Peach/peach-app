import React, { useMemo } from 'react'
import { View } from 'react-native'
import { useHeaderSetup } from '../../hooks'
import tw from '../../styles/tailwind'
import i18n from '../../utils/i18n'
import { TxSummaryItem } from './components/TxSummaryItem'
import { useTransactionHistorySetup } from './hooks/useTransactionHistorySetup'

export default () => {
  useHeaderSetup(useMemo(() => ({ title: i18n('wallet.transactionHistory') }), []))
  const { transactions } = useTransactionHistorySetup()

  return (
    <View style={tw`px-8 pt-12`}>
      {transactions.map((tx, i) => (
        <TxSummaryItem key={tx.id} style={i > 0 ? tw`mt-4` : {}} tx={tx} />
      ))}
    </View>
  )
}
