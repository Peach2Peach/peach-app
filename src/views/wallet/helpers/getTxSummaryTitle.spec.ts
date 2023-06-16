import { getTxSummaryTitle } from './getTxSummaryTitle'

describe('getTxSummaryTitle', () => {
  it('returns the correct string for a trade with an offer ID', () => {
    const tx = { type: 'TRADE', offerId: '16' } as const
    expect(getTxSummaryTitle(tx)).toEqual('P‑10')
  })

  it('returns the correct string for a refund with an offer ID', () => {
    const tx = { type: 'REFUND', offerId: '16' } as const
    expect(getTxSummaryTitle(tx)).toEqual('P‑10')
  })
  it('returns the correct string for a trade with a contract ID', () => {
    const tx = { type: 'TRADE', offerId: '17', contractId: '16-17' } as const
    expect(getTxSummaryTitle(tx)).toEqual('PC‑10‑11')
  })

  it('returns the correct string for a refund with a contract ID', () => {
    const tx = { type: 'REFUND', offerId: '16', contractId: '16-17' } as const
    expect(getTxSummaryTitle(tx)).toEqual('PC‑10‑11')
  })

  it('returns the correct string for a withdrawal without an offer ID', () => {
    const tx = { type: 'WITHDRAWAL' } as const
    expect(getTxSummaryTitle(tx)).toEqual('sent')
  })

  it('returns the correct string for a deposit without an offer ID', () => {
    const tx = { type: 'DEPOSIT' } as const
    expect(getTxSummaryTitle(tx)).toEqual('deposit')
  })
})
