import { TransactionsResponse } from 'bdk-rn/lib/lib/interfaces'
import { mergeTransactionList } from '../mergeTransactionList'

describe('mergeTransactionList', () => {
  const old: TransactionsResponse = {
    confirmed: [],
    pending: [
      { txid: 'txid1', sent: 1, received: 1, fee: 1 },
      { txid: 'txid2', sent: 2, received: 2, fee: 2 },
    ],
  }
  const update: TransactionsResponse = {
    confirmed: [{ txid: 'txid1', block_timestamp: 1, sent: 1, block_height: 1, received: 1, fee: 1 }],
    pending: [{ txid: 'txid2', sent: 2, received: 2, fee: 2 }],
  }
  const expected: TransactionsResponse = {
    confirmed: [{ txid: 'txid1', block_timestamp: 1, sent: 1, block_height: 1, received: 1, fee: 1 }],
    pending: [{ txid: 'txid2', sent: 2, received: 2, fee: 2 }],
  }
  it('should overwrite confirmed transactions', () => {
    expect(mergeTransactionList(old, update).confirmed).toEqual(expected.confirmed)
  })
  it('merge pending transactions and remove those that are confirmed', () => {
    expect(mergeTransactionList(old, update).pending).toEqual(expected.pending)
  })
})
