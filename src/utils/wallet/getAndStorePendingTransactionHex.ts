import { getTxHex } from '../electrum'
import { useWalletState } from './walletStore'

export const getAndStorePendingTransactionHex = async (txId: string) => {
  const hex = useWalletState.getState().pendingTransactions[txId]
  if (hex) return hex

  const [result] = await getTxHex({ txId })
  if (result) useWalletState.getState().addPendingTransactionHex(txId, result)
  return result
}
