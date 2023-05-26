import { getTxHex } from '../electrum/getTxHex'
import { walletStore } from './walletStore'

export const getAndStorePendingTransactionHex = async (txId: string) => {
  const hex = walletStore.getState().pendingTransactions[txId]
  if (hex) return hex

  const [result] = await getTxHex({ txId })
  if (result) walletStore.getState().addPendingTransactionHex(txId, result)
  return result
}
