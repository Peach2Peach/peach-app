import { useMemo } from 'react'
import { useRoute } from '../../../hooks/useRoute'
import { useWalletState } from '../../../utils/wallet/walletStore'
import { getTxSummary } from '../helpers/getTxSummary'
import { useMappedTransactionDetails } from './useMappedTransactionDetails'
import { useSyncWallet } from './useSyncWallet'

export const useTransactionDetailsSetup = () => {
  const { txId } = useRoute<'transactionDetails'>().params
  const localTx = useWalletState((state) => state.getTransaction(txId))
  const transactionDetails = useMappedTransactionDetails({ localTx })
  const transactionSummary = useMemo(() => (localTx ? getTxSummary(localTx) : undefined), [localTx])
  const { refresh, isRefreshing } = useSyncWallet()

  return { localTx, transactionDetails, transactionSummary, refresh, isRefreshing }
}
