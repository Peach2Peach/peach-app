import { getTxSummaryTitle } from './getTxSummaryTitle'

describe('getTxSummaryTitle', () => {
  it('returns the correct string for a trade with an offer ID', () => {
    const tx: Partial<TransactionSummary> = {
      type: 'TRADE',
      offerId: '16',
    }
    expect(getTxSummaryTitle(tx as TransactionSummary)).toEqual('P‑10')
  })

  it('returns the correct string for a refund with an offer ID', () => {
    const tx: Partial<TransactionSummary> = {
      type: 'REFUND',
      offerId: '16',
    }
    expect(getTxSummaryTitle(tx as TransactionSummary)).toEqual('P‑10')
  })
  it('returns the correct string for a trade with a contract ID', () => {
    const tx: Partial<TransactionSummary> = {
      type: 'TRADE',
      offerId: '17',
      contractId: '16-17',
    }
    expect(getTxSummaryTitle(tx as TransactionSummary)).toEqual('PC‑10‑11')
  })

  it('returns the correct string for a refund with a contract ID', () => {
    const tx: Partial<TransactionSummary> = {
      type: 'REFUND',
      offerId: '16',
      contractId: '16-17',
    }
    expect(getTxSummaryTitle(tx as TransactionSummary)).toEqual('PC‑10‑11')
  })

  it('returns the correct string for a withdrawal without an offer ID', () => {
    const tx: Partial<TransactionSummary> = { type: 'WITHDRAWAL' }
    expect(getTxSummaryTitle(tx as TransactionSummary)).toEqual('sent')
  })

  it('returns the correct string for a deposit without an offer ID', () => {
    const tx: Partial<TransactionSummary> = { type: 'DEPOSIT' }
    expect(getTxSummaryTitle(tx as TransactionSummary)).toEqual('deposit')
  })
})
