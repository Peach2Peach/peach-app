import { useFocusEffect } from '@react-navigation/native'
import { useCallback, useState } from 'react'
import { useHeaderSetup } from '../../../hooks'
import { sort } from '../../../utils/array'
import i18n from '../../../utils/i18n'
import { useWalletState } from '../../../utils/wallet/walletStore'
import { getTxSummary } from '../helpers/getTxSummary'
import { useSyncWallet } from './useSyncWallet'

export const useTransactionHistorySetup = () => {
  const storedTransactions = useWalletState((state) => state.transactions)
  const { refresh, isRefreshing } = useSyncWallet()
  const [transactions, setTransactions] = useState<TransactionSummary[]>([])

  useHeaderSetup({
    title: i18n('wallet.transactionHistory'),
  })

  useFocusEffect(
    useCallback(() => {
      setTransactions(storedTransactions.map(getTxSummary).sort(sort('date'))
        .reverse())
    }, [storedTransactions]),
  )
  return {
    transactions,
    refresh,
    isRefreshing,
  }
}
