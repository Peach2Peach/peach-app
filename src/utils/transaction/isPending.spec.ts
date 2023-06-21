import { isPending } from './isPending'

describe('isPending', () => {
  const confirmationTime = { height: 1, timestamp: 1 }
  const pending = { txid: 'txid2', sent: 2, received: 2, fee: 2 }
  const confirmed = { txid: 'txid1', confirmationTime, sent: 1, received: 1, fee: 1 }
  it('should return true for a pending transaction', () => {
    expect(isPending(pending)).toEqual(true)
  })

  it('should return false for a confirmed transaction', () => {
    expect(isPending(confirmed)).toEqual(false)
  })
})
