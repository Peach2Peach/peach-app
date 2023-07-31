import { TransactionDetails } from 'bdk-rn/lib/classes/Bindings'
import { useWalletState } from './walletStore'

export const storePendingTransactionHex = async (transaction: TransactionDetails) => {
  let hex = useWalletState.getState().pendingTransactions[transaction.txid]
  if (hex) return hex

  const serialized = await transaction.transaction?.serialize()
  if (!serialized) return hex

  hex = Buffer.from(serialized).toString('hex')

  if (!hex) return hex
  useWalletState.getState().addPendingTransactionHex(transaction.txid, hex)
  return hex
}
