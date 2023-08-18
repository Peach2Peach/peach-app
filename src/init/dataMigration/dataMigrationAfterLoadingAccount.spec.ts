import { PAYMENTMETHODINFOS } from '../../paymentMethods'
import { dataMigrationAfterLoadingAccount } from './dataMigrationAfterLoadingAccount'

const checkSupportedPaymentMethodsMock = jest.fn()
const checkUsedReferralCodeMock = jest.fn()
jest.mock('./afterLoadingAccount/checkSupportedPaymentMethods', () => ({
  checkSupportedPaymentMethods: (...args: any[]) => checkSupportedPaymentMethodsMock(...args),
}))
jest.mock('./afterLoadingAccount/checkUsedReferralCode', () => ({
  checkUsedReferralCode: (...args: any[]) => checkUsedReferralCodeMock(...args),
}))

describe('dataMigrationAfterLoadingAccount', () => {
  it('should call checkSupportedPaymentMethods', () => {
    dataMigrationAfterLoadingAccount()
    expect(checkSupportedPaymentMethodsMock).toHaveBeenCalledWith(PAYMENTMETHODINFOS)
  })

  it('should call checkUsedReferralCode', () => {
    dataMigrationAfterLoadingAccount()
    expect(checkUsedReferralCodeMock).toHaveBeenCalled()
  })
})
