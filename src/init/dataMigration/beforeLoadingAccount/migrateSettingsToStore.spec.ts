import { settings1 } from '../../../../tests/unit/data/settingsData'
import { defaultSettings } from '../../../store/defaults'
import { settingsStore } from '../../../store/settingsStore'
import { migrateSettingsToStore } from './migrateSettingsToStore'

const loadSettingsMock = jest.fn()
jest.mock('./helpers/loadSettings', () => ({
  loadSettings: () => loadSettingsMock(),
}))

describe('migrateSettingsToStore', () => {
  afterEach(() => {
    settingsStore.getState().reset()
  })
  it('loads default settings if no stored settings have been found', async () => {
    await migrateSettingsToStore()
    expect(loadSettingsMock).toHaveBeenCalledWith()
    expect(settingsStore.getState()).toEqual(expect.objectContaining(defaultSettings))
  })
  it('loads settings if stored settings have been found', async () => {
    loadSettingsMock.mockResolvedValueOnce(settings1)
    await migrateSettingsToStore()
    expect(loadSettingsMock).toHaveBeenCalledWith()
    expect(settingsStore.getState()).toEqual(expect.objectContaining(settings1))
  })
  it('does not migrate twice', async () => {
    await migrateSettingsToStore()
    await migrateSettingsToStore()
    expect(loadSettingsMock).toHaveBeenCalledTimes(1)
  })
})
