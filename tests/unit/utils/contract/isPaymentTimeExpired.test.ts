import { isPaymentTimeExpired } from '../../../../src/utils/contract'
import { contract } from '../../data/contractData'

describe('isPaymentTimeExpired', () => {
  const THIRTYDAYSINMS = 2592000000

  it('returns true if payment time is expired', () => {
    expect(isPaymentTimeExpired({ ...contract, paymentExpectedBy: new Date(Date.now() - THIRTYDAYSINMS) })).toBe(true)
  })
  it('returns false if payment time is not expired', () => {
    expect(isPaymentTimeExpired({ ...contract, paymentExpectedBy: new Date(Date.now() + 1) })).toBe(false)
  })
})
