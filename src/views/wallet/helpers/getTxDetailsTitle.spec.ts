import { getTxDetailsTitle } from './getTxDetailsTitle'

describe('getTxDetailsTitle', () => {
  it('returns the correct string for a trade with an offer ID', () => {
    const tx: Partial<TransactionSummary> = {
      type: 'TRADE',
      offerId: '16',
    }
    const result = getTxDetailsTitle(tx as TransactionSummary)
    expect(result).toEqual('stacked sats - P‑10')
  })

  it('returns the correct string for a trade with a contract ID', () => {
    const tx: Partial<TransactionSummary> = {
      type: 'TRADE',
      offerId: '16',
      contractId: '16-17',
    }
    const result = getTxDetailsTitle(tx as TransactionSummary)
    expect(result).toEqual('stacked sats - PC‑10‑11')
  })

  it('returns the correct string for a refund with an offer ID', () => {
    const tx: Partial<TransactionSummary> = {
      type: 'REFUND',
      offerId: '16',
    }
    const result = getTxDetailsTitle(tx as TransactionSummary)
    expect(result).toEqual('refund - P‑10')
  })
  it('returns the correct string for a refund with a contract ID', () => {
    const tx: Partial<TransactionSummary> = {
      type: 'REFUND',
      offerId: '16',
      contractId: '16-17',
    }
    const result = getTxDetailsTitle(tx as TransactionSummary)
    expect(result).toEqual('refund - PC‑10‑11')
  })

  it('returns the correct string for a withdrawal without an offer ID', () => {
    const tx: Partial<TransactionSummary> = {
      type: 'WITHDRAWAL',
    }
    const result = getTxDetailsTitle(tx as TransactionSummary)
    expect(result).toEqual('sent')
  })

  it('returns the correct string for a deposit without an offer ID', () => {
    const tx: Partial<TransactionSummary> = {
      type: 'DEPOSIT',
    }
    const result = getTxDetailsTitle(tx as TransactionSummary)
    expect(result).toEqual('deposit')
  })
})
