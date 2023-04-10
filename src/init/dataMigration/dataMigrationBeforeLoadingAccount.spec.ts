import { dataMigrationBeforeLoadingAccount } from '.'

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
})
