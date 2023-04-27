import { settingsStore } from './settingsStore'

describe('settingsStore', () => {
  it('should keep analytics popup seen state when resetting', () => {
    settingsStore.getState().setAnalyticsPopupSeen(true)
    settingsStore.getState().reset()
    expect(settingsStore.getState().analyticsPopupSeen).toBeTruthy()
  })
})
