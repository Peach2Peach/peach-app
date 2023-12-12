import { postTransaction } from '../electrum/postTransaction'
import { isDefined } from '../validation/isDefined'
import { useWalletState } from './walletStore'

export const rebroadcastTransactions = (toRebroadcast: string[]) =>
  Promise.all(
    toRebroadcast
      .map((txId) => ({ txId, hex: useWalletState.getState().pendingTransactions[txId] }))
      .filter(({ hex }) => isDefined(hex))
      .map(async ({ txId, hex }) => {
        const [response, err] = await postTransaction({ tx: hex })
        if (err?.toString().includes('bad-txns-inputs-missingorspent')) {
          useWalletState.getState().removePendingTransaction(txId)
        }
        if (response) useWalletState.getState().removePendingTransaction(response)
      }),
  )
