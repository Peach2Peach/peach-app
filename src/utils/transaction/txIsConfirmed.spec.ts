import { ConfirmedTransaction, PendingTransaction } from 'bdk-rn/lib/lib/interfaces'
import { txIsConfirmed } from '.'

describe('txIsConfirmed', () => {
  it('should return true for a ConfirmedTransaction', () => {
    const tx: ConfirmedTransaction = {
      txid: '123',
      block_timestamp: 123,
      sent: 1,
      block_height: 1,
      received: 1,
      fee: 1,
    }
    const result = txIsConfirmed(tx)
    expect(result).toEqual(true)
  })

  it('should return false for a PendingTransaction', () => {
    const tx: PendingTransaction = {
      txid: '123',
      sent: 1,
      received: 1,
      fee: 1,
    }
    const result = txIsConfirmed(tx)
    expect(result).toEqual(false)
  })
})
