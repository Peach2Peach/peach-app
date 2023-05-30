import { TransactionsResponse } from 'bdk-rn/lib/lib/interfaces'
import { unique } from '../array'

export const mergeTransactionList = (transactions: TransactionsResponse, txUpdate: TransactionsResponse) => ({
  confirmed: txUpdate.confirmed,
  pending: [...transactions.pending, ...txUpdate.pending]
    .filter(unique('txid'))
    .filter(({ txid }) => !txUpdate.confirmed.find((confirmed) => confirmed.txid === txid)),
})
