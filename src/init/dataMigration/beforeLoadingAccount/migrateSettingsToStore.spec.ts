import { settings1 } from '../../../../tests/unit/data/settingsData'
import { useSettingsStore, defaultSettings } from '../../../store/useSettingsStore'
import { migrateSettingsToStore } from './migrateSettingsToStore'

const loadSettingsMock = jest.fn()
jest.mock('./helpers/loadSettings', () => ({
  loadSettings: () => loadSettingsMock(),
}))

describe('migrateSettingsToStore', () => {
  afterEach(() => {
    useSettingsStore.getState().reset()
  })
  it('loads default settings if no stored settings have been found', () => {
    migrateSettingsToStore()
    expect(loadSettingsMock).toHaveBeenCalledWith()
    expect(useSettingsStore.getState()).toEqual(expect.objectContaining(defaultSettings))
  })
  it('loads settings if stored settings have been found', () => {
    loadSettingsMock.mockReturnValueOnce(settings1)
    migrateSettingsToStore()
    expect(loadSettingsMock).toHaveBeenCalledWith()
    expect(useSettingsStore.getState()).toEqual(expect.objectContaining(settings1))
  })
  it('does not migrate twice', () => {
    migrateSettingsToStore()
    migrateSettingsToStore()
    expect(loadSettingsMock).toHaveBeenCalledTimes(1)
  })
})
