import { TransactionDetails } from 'bdk-rn/lib/classes/Bindings'
import { isPending } from './isPending'

export const findTransactionsToRebroadcast = (known: TransactionDetails[], update: TransactionDetails[]) => {
  const knownPending = known.filter(isPending)
  const updatePending = update.filter(isPending).map(({ txid }) => txid)
  return knownPending.filter(({ txid }) => !updatePending.includes(txid))
}
