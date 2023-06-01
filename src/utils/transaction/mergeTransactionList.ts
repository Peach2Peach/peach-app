import { TransactionDetails } from 'bdk-rn/lib/classes/Bindings'
import { unique } from '../array'
import { isPending } from '.'

export const mergeTransactionList = (transactions: TransactionDetails[], txUpdate: TransactionDetails[]) =>
  [...txUpdate, ...transactions.filter(isPending)].filter(unique('txid'))
