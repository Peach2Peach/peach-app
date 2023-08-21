import { dataMigrationBeforeLoadingAccount } from '.'

const migrateSettingsToStoreMock = jest.fn()
jest.mock('./beforeLoadingAccount/migrateSettingsToStore', () => ({
  migrateSettingsToStore: (...args: unknown[]) => migrateSettingsToStoreMock(...args),
}))
const migrateContractsToStoreMock = jest.fn()
jest.mock('./beforeLoadingAccount/migrateContractsToStore', () => ({
  migrateContractsToStore: (...args: unknown[]) => migrateContractsToStoreMock(...args),
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
  it('should migrate contracts to store', () => {
    dataMigrationBeforeLoadingAccount()
    expect(migrateContractsToStoreMock).toHaveBeenCalled()
  })
  it('should migrate paymentData to store', () => {
    dataMigrationBeforeLoadingAccount()
    expect(migratePaymentDataToStoreMock).toHaveBeenCalled()
  })
})
