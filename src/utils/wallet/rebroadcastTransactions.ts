import { postTx } from '../peachAPI'
import { walletStore, WalletState } from './walletStore'

export const rebroadcastTransactions = (pending: WalletState['pendingTransactions']) =>
  Promise.all(
    Object.keys(pending).map(async (txId) => {
      const hex = pending[txId]
      const [response] = await postTx({ tx: hex })
      if (response?.txId) walletStore.getState().removePendingTransaction(txId)
    }),
  )
