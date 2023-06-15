import { TransactionDetails } from 'bdk-rn/lib/classes/Bindings'
import { findTransactionsToRebroadcast } from './findTransactionsToRebroadcast'

describe('findTransactionsToRebroadcast', () => {
  const old: TransactionDetails[] = [
    { txid: 'txid1', sent: 1, received: 1, fee: 1 },
    { txid: 'txid2', sent: 2, received: 2, fee: 2 },
  ]
  const update: TransactionDetails[] = [{ txid: 'txid2', sent: 2, received: 2, fee: 2 }]
  const expected: TransactionDetails[] = [{ txid: 'txid1', sent: 1, received: 1, fee: 1 }]

  it('find transcactions that got lost from wallet', () => {
    expect(findTransactionsToRebroadcast(old, update)).toEqual(expected)
  })
  it('ignores confirmed transcactions', () => {
    const confirmationTime = { height: 1, timestamp: 1 }
    const confirmed = { txid: 'txid1', confirmationTime, sent: 1, received: 1, fee: 1 }
    const withConfirmed = [...old, confirmed]
    expect(findTransactionsToRebroadcast(withConfirmed, update)).toEqual(expected)
  })
})
