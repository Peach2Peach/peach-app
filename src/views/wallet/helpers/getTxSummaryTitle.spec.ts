import i18n from '../../../utils/i18n'
import { getTxSummaryTitle } from './getTxSummaryTitle'

jest.mock('../../../utils/i18n')

describe('getTxSummaryTitle', () => {
  beforeAll(() => {
    ;(<jest.Mock>(<unknown>i18n)).mockImplementation((key: string) => key)
  })
  afterAll(() => {
    jest.resetAllMocks()
  })

  it('returns the correct string for a trade with an offer ID', () => {
    const tx: Partial<TransactionSummary> = {
      type: 'TRADE',
      offerId: '16',
    }
    const result = getTxSummaryTitle(tx as TransactionSummary)
    expect(i18n).toHaveBeenCalledWith('wallet.trade', 'P‑10')
    expect(result).toEqual('wallet.trade')
  })

  it('returns the correct string for a refund with an offer ID', () => {
    const tx: Partial<TransactionSummary> = {
      type: 'REFUND',
      offerId: '16',
    }
    const result = getTxSummaryTitle(tx as TransactionSummary)
    expect(i18n).toHaveBeenCalledWith('wallet.refund', 'P‑10')
    expect(result).toEqual('wallet.refund')
  })

  it('returns the correct string for a withdrawal without an offer ID', () => {
    const tx: Partial<TransactionSummary> = {
      type: 'WITHDRAWAL',
    }
    const result = getTxSummaryTitle(tx as TransactionSummary)
    expect(i18n).toHaveBeenCalledWith('wallet.withdrawal')
    expect(result).toEqual('wallet.withdrawal')
  })

  it('returns the correct string for a deposit without an offer ID', () => {
    const tx: Partial<TransactionSummary> = {
      type: 'DEPOSIT',
    }
    const result = getTxSummaryTitle(tx as TransactionSummary)
    expect(i18n).toHaveBeenCalledWith('wallet.deposit')
    expect(result).toEqual('wallet.deposit')
  })
})
