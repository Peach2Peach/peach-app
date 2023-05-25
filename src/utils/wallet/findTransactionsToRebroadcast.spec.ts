import { PendingTransaction } from 'bdk-rn/lib/lib/interfaces'
import { findTransactionsToRebroadcast } from './findTransactionsToRebroadcast'

describe('findTransactionsToRebroadcast', () => {
  const old: PendingTransaction[] = [
    { txid: 'txid1', sent: 1, received: 1, fee: 1 },
    { txid: 'txid2', sent: 2, received: 2, fee: 2 },
  ]
  const update: PendingTransaction[] = [{ txid: 'txid2', sent: 2, received: 2, fee: 2 }]
  const expected: PendingTransaction[] = [{ txid: 'txid1', sent: 1, received: 1, fee: 1 }]

  it('find transcactions that got lost from wallet', () => {
    expect(findTransactionsToRebroadcast(old, update)).toEqual(expected)
  })
})
