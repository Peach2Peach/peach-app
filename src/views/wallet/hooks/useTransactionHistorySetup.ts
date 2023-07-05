import { useMemo } from 'react'
import { useHeaderSetup } from '../../../hooks'
import { sort } from '../../../utils/array'
import i18n from '../../../utils/i18n'
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

  useHeaderSetup({
    title: i18n('wallet.transactionHistory'),
  })

  return {
    transactions,
    ...walletSynchronizer,
  }
}
