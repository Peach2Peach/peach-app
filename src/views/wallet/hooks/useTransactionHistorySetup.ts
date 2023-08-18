import { useMemo } from 'react'
import { sort } from '../../../utils/array'
import { useWalletState } from '../../../utils/wallet/walletStore'
import { getTxSummary } from '../helpers/getTxSummary'
import { useSyncWallet } from './useSyncWallet'

export const useTransactionHistorySetup = () => {
  const storedTransactions = useWalletState((state) => state.transactions)
  const walletSynchronizer = useSyncWallet()

  const transactions = useMemo(
    () => storedTransactions.map(getTxSummary).sort(sort('date'))
      .reverse(),
    [storedTransactions],
  )

  return {
    transactions,
    ...walletSynchronizer,
  }
}
