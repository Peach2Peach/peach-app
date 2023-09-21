import { useMemo } from 'react'
import { useHeaderSetup, useRoute } from '../../../hooks'
import i18n from '../../../utils/i18n'
import { useWalletState } from '../../../utils/wallet/walletStore'
import { getTxSummary } from '../helpers/getTxSummary'
import { useSyncWallet } from './useSyncWallet'

export const useTransactionDetailsSetup = () => {
  const { txId } = useRoute<'transactionDetails'>().params
  const tx = useWalletState((state) => state.getTransaction(txId))
  const transaction = useMemo(() => (tx ? getTxSummary(tx) : undefined), [tx])
  const { refresh, isRefreshing } = useSyncWallet()

  useHeaderSetup(i18n('wallet.transactionDetails'))

  return {
    transaction,
    refresh,
    isRefreshing,
  }
}
