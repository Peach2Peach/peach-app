import { defaultSettings } from '../defaults'
import { settingsStore } from '../settingsStore'
import { getPureSettingsState } from './getPureSettingsState'

describe('getPureSettingsState', () => {
  it('returns pure settings state', () => {
    expect(getPureSettingsState(settingsStore.getState())).toEqual(defaultSettings)
  })
})
