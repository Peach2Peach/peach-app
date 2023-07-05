import { dataMigrationAfterLoadingAccount } from '.'
import { PAYMENTMETHODINFOS } from '../../constants'

const checkSupportedPaymentMethodsMock = jest.fn()
const enforcePaymentDataFormatsMock = jest.fn()
const checkUsedReferralCodeMock = jest.fn()
const migratePaymentDataMock = jest.fn()
jest.mock('./afterLoadingAccount/checkSupportedPaymentMethods', () => ({
  checkSupportedPaymentMethods: (...args: any[]) => checkSupportedPaymentMethodsMock(...args),
}))
jest.mock('./afterLoadingAccount/enforcePaymentDataFormats', () => ({
  enforcePaymentDataFormats: (...args: any[]) => enforcePaymentDataFormatsMock(...args),
}))
jest.mock('./afterLoadingAccount/checkUsedReferralCode', () => ({
  checkUsedReferralCode: (...args: any[]) => checkUsedReferralCodeMock(...args),
}))
jest.mock('./afterLoadingAccount/migratePaymentData', () => ({
  migratePaymentData: (...args: any[]) => migratePaymentDataMock(...args),
}))

describe('dataMigrationAfterLoadingAccount', () => {
  const account = {
    paymentData: {},
    publicKey: '',
  } as Account

  beforeEach(() => {
    jest.resetAllMocks()
  })

  it('should call checkSupportedPaymentMethods', () => {
    dataMigrationAfterLoadingAccount(account)
    expect(checkSupportedPaymentMethodsMock).toHaveBeenCalledWith(account.paymentData, PAYMENTMETHODINFOS)
  })

  it('should call enforcePaymentDataFormats', () => {
    dataMigrationAfterLoadingAccount(account)
    expect(enforcePaymentDataFormatsMock).toHaveBeenCalledWith(account, account.paymentData)
  })

  it('should call checkUsedReferralCode', () => {
    dataMigrationAfterLoadingAccount(account)
    expect(checkUsedReferralCodeMock).toHaveBeenCalled()
  })
  it('should call migratePaymentData', () => {
    dataMigrationAfterLoadingAccount(account)
    expect(migratePaymentDataMock).toHaveBeenCalledWith(account.paymentData)
  })
})
