import { PendingTransaction } from 'bdk-rn/lib/lib/interfaces'

export const findTransactionsToRebroadcast = (knownPending: PendingTransaction[], pendingUpdate: PendingTransaction[]) =>
  knownPending.filter(({ txid }) => !pendingUpdate.find((pending) => pending.txid === txid))
