import { isDefined } from '../array/isDefined'
import { postTransaction } from '../electrum/postTransaction'
import { walletStore } from './walletStore'

export const rebroadcastTransactions = (toRebroadcast: string[]) => {
  Promise.all(
    toRebroadcast
      .map((txId) => ({ txId, hex: walletStore.getState().pendingTransactions[txId] }))
      .filter(({ hex }) => isDefined(hex))
      .map(async ({ txId, hex }) => {
        const [response, err] = await postTransaction({ tx: hex })
        if (err?.toString().includes('bad-txns-inputs-missingorspent')) {
          walletStore.getState().removePendingTransaction(txId)
        }
        if (response) walletStore.getState().removePendingTransaction(response)
      }),
  )
}
