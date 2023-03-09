import { dataMigrationAfterLoadingAccount } from '../../../../src/init/dataMigration'
import { PAYMENTMETHODINFOS } from '../../../../src/constants'

const checkSupportedPaymentMethodsMock = jest.fn()
const enforcePaymentDataFormatsMock = jest.fn()
const checkUsedReferralCodeMock = jest.fn()
jest.mock('../../../../src/init/dataMigration/afterLoadingAccount/checkSupportedPaymentMethods', () => ({
  checkSupportedPaymentMethods: (...args) => checkSupportedPaymentMethodsMock(...args),
}))
jest.mock('../../../../src/init/dataMigration/afterLoadingAccount/enforcePaymentDataFormats', () => ({
  enforcePaymentDataFormats: (...args) => enforcePaymentDataFormatsMock(...args),
}))
jest.mock('../../../../src/init/dataMigration/afterLoadingAccount/checkUsedReferralCode', () => ({
  checkUsedReferralCode: (...args) => checkUsedReferralCodeMock(...args),
}))

describe('dataMigrationAfterLoadingAccount', () => {
  const account = {
    paymentData: {},
    publicKey: '',
  } as Account

  beforeEach(() => {
    jest.resetAllMocks()
  })

  it('should call checkSupportedPaymentMethods', async () => {
    await dataMigrationAfterLoadingAccount(account)
    expect(checkSupportedPaymentMethodsMock).toHaveBeenCalledWith(account.paymentData, PAYMENTMETHODINFOS)
  })

  it('should call enforcePaymentDataFormats', async () => {
    await dataMigrationAfterLoadingAccount(account)
    expect(enforcePaymentDataFormatsMock).toHaveBeenCalledWith(account.paymentData)
  })

  it('should call checkUsedReferralCode', async () => {
    await dataMigrationAfterLoadingAccount(account)
    expect(checkUsedReferralCodeMock).toHaveBeenCalledWith(account.publicKey)
  })
})
