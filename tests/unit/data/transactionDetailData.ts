import { TransactionDetails } from 'bdk-rn/lib/classes/Bindings'

export const confirmed1: TransactionDetails = {
  txid: 'txid1',
  sent: 1,
  received: 1,
  fee: 1,
  confirmationTime: { height: 1, timestamp: 1 },
}
export const confirmed2: TransactionDetails = {
  txid: 'txid2',
  sent: 2,
  received: 2,
  fee: 2,
  confirmationTime: { height: 2, timestamp: 2 },
}
export const confirmed3: TransactionDetails = {
  txid: 'txid3',
  sent: 3,
  received: 3,
  fee: 3,
  confirmationTime: { height: 3, timestamp: 3 },
}
export const pending1: TransactionDetails = { txid: 'txid1', sent: 1, received: 1, fee: 1 }
export const pending2: TransactionDetails = { txid: 'txid2', sent: 2, received: 2, fee: 2 }
export const pending3: TransactionDetails = { txid: 'txid3', sent: 3, received: 3, fee: 3 }
