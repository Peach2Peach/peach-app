import { contract } from '../../../../tests/unit/data/contractData'
import { isPaymentTooLate } from './isPaymentTooLate'
describe('isPaymentTooLate', () => {
  const dateNowSpy = jest.spyOn(Date, 'now')
  const mockContract = {
    ...contract,
    paymentMade: null,
  }
  it('should return false if paymentMade is true', () => {
    expect(isPaymentTooLate({ ...mockContract, paymentMade: new Date() })).toEqual(false)
  })
  it('should return false if paymentExpectedBy is greater than Date.now', () => {
    dateNowSpy.mockReturnValue(100)
    expect(isPaymentTooLate({ ...mockContract, paymentExpectedBy: new Date(200) })).toEqual(false)
  })
  it('should return true if paymentExpectedBy is less than Date.now', () => {
    dateNowSpy.mockReturnValue(200)
    expect(isPaymentTooLate({ ...mockContract, paymentExpectedBy: new Date(100) })).toEqual(true)
  })
})
