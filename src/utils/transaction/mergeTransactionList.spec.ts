import { mergeTransactionList } from './mergeTransactionList'
import { TransactionDetails } from 'bdk-rn/lib/classes/Bindings'

describe('mergeTransactionList', () => {
  const confirmationTime = { height: 1, timestamp: 1 }
  const old: TransactionDetails[] = [
    { txid: 'txid1', sent: 1, received: 1, fee: 1 },
    { txid: 'txid2', sent: 2, received: 2, fee: 2 },
    { txid: 'txid3', sent: 3, received: 3, fee: 3 },
  ]
  const update: TransactionDetails[] = [
    { txid: 'txid1', confirmationTime, sent: 1, received: 1, fee: 1 },
    { txid: 'txid3', sent: 3, received: 3, fee: 3 },
  ]
  const expected: TransactionDetails[] = [
    { txid: 'txid1', confirmationTime, sent: 1, received: 1, fee: 1 },
    { txid: 'txid3', sent: 3, received: 3, fee: 3 },
    { txid: 'txid2', sent: 2, received: 2, fee: 2 },
  ]
  it('should overwrite confirmed transactions and merge pending transactions', () => {
    expect(mergeTransactionList(old, update)).toEqual(expected)
  })
})
