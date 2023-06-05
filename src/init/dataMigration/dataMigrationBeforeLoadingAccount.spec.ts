import { dataMigrationBeforeLoadingAccount } from '.'
import { useAccountStore } from '../../store/accountStore'
import { useLocalContractStore } from '../../store/useLocalContractStore'

const migrateSettingsToStoreMock = jest.fn()
jest.mock('./beforeLoadingAccount/migrateSettingsToStore', () => ({
  migrateSettingsToStore: (...args: any[]) => migrateSettingsToStoreMock(...args),
}))

describe('dataMigrationBeforeLoadingAccount', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })
  it('should call migrateSettingsToStore', async () => {
    await dataMigrationBeforeLoadingAccount()
    expect(migrateSettingsToStoreMock).toHaveBeenCalled()
  })
  it('should migrate contracts to store', async () => {
    await dataMigrationBeforeLoadingAccount()
    expect(useLocalContractStore.getState().migrated).toBe(true)
  })
  it('should migrate account to store', async () => {
    await dataMigrationBeforeLoadingAccount()
    expect(useAccountStore.getState().migrated).toBe(true)
  })
})
