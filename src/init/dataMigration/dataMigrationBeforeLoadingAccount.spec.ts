import { dataMigrationBeforeLoadingAccount } from '.'
import { useLocalContractStore } from '../../store/useLocalContractStore'

const migrateSettingsToStoreMock = jest.fn()
jest.mock('./beforeLoadingAccount/migrateSettingsToStore', () => ({
  migrateSettingsToStore: (...args: any[]) => migrateSettingsToStoreMock(...args),
}))

describe('dataMigrationBeforeLoadingAccount', () => {
  it('should call migrateSettingsToStore', () => {
    dataMigrationBeforeLoadingAccount()
    expect(migrateSettingsToStoreMock).toHaveBeenCalled()
  })
  it('should migrate contracts to store', () => {
    dataMigrationBeforeLoadingAccount()
    expect(useLocalContractStore.getState().migrated).toBe(true)
  })
})
