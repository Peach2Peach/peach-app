import { dataMigrationBeforeLoadingAccount } from './dataMigrationBeforeLoadingAccount'

const migrateContractsToStoreMock = jest.fn()
jest.mock('./beforeLoadingAccount/migrateContractsToStore', () => ({
  migrateContractsToStore: (...args: any[]) => migrateContractsToStoreMock(...args),
}))

describe('dataMigrationBeforeLoadingAccount', () => {
  it('should call migrateContractsToStore', async () => {
    await dataMigrationBeforeLoadingAccount()
    expect(migrateContractsToStoreMock).toHaveBeenCalledWith()
  })
})
