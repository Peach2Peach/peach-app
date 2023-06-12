import { settingsStore } from './settingsStore'
import analytics from '@react-native-firebase/analytics'
import perf from '@react-native-firebase/perf'

describe('settingsStore', () => {
  it('should keep analytics popup seen state when resetting', () => {
    settingsStore.getState().setAnalyticsPopupSeen(true)
    settingsStore.getState().reset()
    expect(settingsStore.getState().analyticsPopupSeen).toBeTruthy()
  })
  it('should enable analytics', () => {
    settingsStore.getState().setEnableAnalytics(true)
    expect(analytics().setAnalyticsCollectionEnabled).toHaveBeenCalledWith(true)
    expect(perf().setPerformanceCollectionEnabled).toHaveBeenCalledWith(true)
  })
  it('should disable analytics', () => {
    settingsStore.getState().setEnableAnalytics(false)
    expect(analytics().setAnalyticsCollectionEnabled).toHaveBeenCalledWith(false)
    expect(perf().setPerformanceCollectionEnabled).toHaveBeenCalledWith(false)
  })
  it('should keep locale state when resetting', () => {
    settingsStore.getState().setLocale('es')
    settingsStore.getState().reset()
    expect(settingsStore.getState().locale).toBe('es')
  })
})
