import { getTxDetailsTitle } from './getTxDetailsTitle'

describe('getTxDetailsTitle', () => {
  it('returns the correct string for a trade with an offer ID', () => {
    const tx = { type: 'TRADE', offerId: '16' } as const
    const result = getTxDetailsTitle(tx)
    expect(result).toEqual('stacked sats - P‑10')
  })

  it('returns the correct string for a trade with a contract ID', () => {
    const tx = { type: 'TRADE', offerId: '16', contractId: '16-17' } as const
    const result = getTxDetailsTitle(tx)
    expect(result).toEqual('stacked sats - PC‑10‑11')
  })

  it('returns the correct string for a refund with an offer ID', () => {
    const tx = { type: 'REFUND', offerId: '16' } as const
    const result = getTxDetailsTitle(tx)
    expect(result).toEqual('refund - P‑10')
  })
  it('returns the correct string for a refund with a contract ID', () => {
    const tx = { type: 'REFUND', offerId: '16', contractId: '16-17' } as const
    const result = getTxDetailsTitle(tx)
    expect(result).toEqual('refund - PC‑10‑11')
  })

  it('returns the correct string for a withdrawal without an offer ID', () => {
    const tx = { type: 'WITHDRAWAL' } as const
    const result = getTxDetailsTitle(tx)
    expect(result).toEqual('sent')
  })

  it('returns the correct string for a deposit without an offer ID', () => {
    const tx = { type: 'DEPOSIT' } as const
    const result = getTxDetailsTitle(tx)
    expect(result).toEqual('received')
  })
})
