import { useFocusEffect } from '@react-navigation/native'
import { useCallback, useMemo, useState } from 'react'

import { useHeaderSetup } from '../../../hooks'
import { sort } from '../../../utils/array'
import i18n from '../../../utils/i18n'
import { useWalletState } from '../../../utils/wallet/walletStore'
import { getTxSummary } from '../helpers/getTxSummary'
import { useSyncWallet } from './useSyncWallet'

export const useTransactionHistorySetup = () => {
  const walletStore = useWalletState((state) => state)
  const { refresh, isRefreshing } = useSyncWallet()
  const [transactions, setTransactions] = useState<TransactionSummary[]>([])

  useHeaderSetup(
    useMemo(
      () => ({
        title: i18n('wallet.transactionHistory'),
      }),
      [],
    ),
  )

  useFocusEffect(
    useCallback(() => {
      setTransactions(walletStore.getAllTransactions().map(getTxSummary)
        .sort(sort('date'))
        .reverse())
    }, [walletStore]),
  )
  return {
    transactions,
    refresh,
    isRefreshing,
  }
}
