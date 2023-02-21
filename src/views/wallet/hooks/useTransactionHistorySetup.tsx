import { useFocusEffect } from '@react-navigation/native'
import { useCallback, useMemo, useState } from 'react'

import { useHeaderSetup } from '../../../hooks'
import { sort } from '../../../utils/array'
import i18n from '../../../utils/i18n'
import { peachWallet } from '../../../utils/wallet/setWallet'
import { useWalletState } from '../../../utils/wallet/walletStore'
import { getTxSummary } from '../helpers/getTxSummary'

export const useTransactionHistorySetup = () => {
  const walletStore = useWalletState()
  const [loading, setLoading] = useState(!peachWallet.synced)
  const [transactions, setTransactions] = useState<TransactionSummary[]>([])

  useHeaderSetup(
    useMemo(
      () => ({
        title: i18n('wallet.transactionHistory'),
      }),
      [],
    ),
  )

  const refresh = async () => {
    if (loading) return
    setLoading(true)
    await peachWallet.syncWallet()
    setLoading(false)
  }

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
    loading,
  }
}
