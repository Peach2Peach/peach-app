import { settingsStore } from './settingsStore'

describe('settingsStore', () => {
  it('should keep analytics popup seen state when resetting', () => {
    settingsStore.getState().setAnalyticsPopupSeen(true)
    settingsStore.getState().reset()
    expect(settingsStore.getState().analyticsPopupSeen).toBeTruthy()
  })
  it('should keep locale  state when resetting', () => {
    settingsStore.getState().setLocale('es')
    settingsStore.getState().reset()
    expect(settingsStore.getState().locale).toBe('es')
  })
})
