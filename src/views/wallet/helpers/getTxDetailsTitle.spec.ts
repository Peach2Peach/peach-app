import { getTxDetailsTitle } from './getTxDetailsTitle'

describe('getTxDetailsTitle', () => {
  it('returns the correct string for a trade', () => {
    expect(getTxDetailsTitle('TRADE')).toEqual('stacked sats')
  })

  it('returns the correct string for a refund', () => {
    expect(getTxDetailsTitle('REFUND')).toEqual('refunded')
  })

  it('returns the correct string for a withdrawal', () => {
    expect(getTxDetailsTitle('WITHDRAWAL')).toEqual('sent from wallet')
  })

  it('returns the correct string for a deposit', () => {
    expect(getTxDetailsTitle('DEPOSIT')).toEqual('received to wallet')
  })
})
