import { dataMigrationBeforeLoadingAccount } from '.'

const migrateSettingsToStoreMock = jest.fn()
jest.mock('./beforeLoadingAccount/migrateSettingsToStore', () => ({
  migrateSettingsToStore: (...args: unknown[]) => migrateSettingsToStoreMock(...args),
}))
const migratePaymentDataToStoreMock = jest.fn()
jest.mock('./beforeLoadingAccount/migratePaymentDataToStore', () => ({
  migratePaymentDataToStore: (...args: unknown[]) => migratePaymentDataToStoreMock(...args),
}))

describe('dataMigrationBeforeLoadingAccount', () => {
  it('should call migrateSettingsToStore', () => {
    dataMigrationBeforeLoadingAccount()
    expect(migrateSettingsToStoreMock).toHaveBeenCalled()
  })
  it('should migrate paymentData to store', () => {
    dataMigrationBeforeLoadingAccount()
    expect(migratePaymentDataToStoreMock).toHaveBeenCalled()
  })
})
