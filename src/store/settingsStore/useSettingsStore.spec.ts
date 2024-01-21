import analytics from '@react-native-firebase/analytics'
import perf from '@react-native-firebase/perf'
import { useSettingsStore } from './useSettingsStore'

describe('settingsStore', () => {
  it('should keep analytics popup seen state when resetting', () => {
    useSettingsStore.getState().setAnalyticsPopupSeen(true)
    useSettingsStore.getState().reset()
    expect(useSettingsStore.getState().analyticsPopupSeen).toBeTruthy()
  })
  it('should enable analytics', () => {
    useSettingsStore.getState().setEnableAnalytics(true)
    expect(analytics().setAnalyticsCollectionEnabled).toHaveBeenCalledWith(true)
    expect(perf().setPerformanceCollectionEnabled).toHaveBeenCalledWith(true)
  })
  it('should disable analytics', () => {
    useSettingsStore.getState().setEnableAnalytics(false)
    expect(analytics().setAnalyticsCollectionEnabled).toHaveBeenCalledWith(false)
    expect(perf().setPerformanceCollectionEnabled).toHaveBeenCalledWith(false)
  })
  it('should keep locale state when resetting', () => {
    useSettingsStore.getState().setLocale('es')
    useSettingsStore.getState().reset()
    expect(useSettingsStore.getState().locale).toBe('es')
  })
})

describe('settingsStore - updateFileBackupDate', () => {
  const now = 1234567890
  jest.spyOn(Date, 'now').mockImplementation(() => now)
  it('should update lastFileBackupDate', () => {
    useSettingsStore.getState().updateFileBackupDate()
    expect(useSettingsStore.getState().lastFileBackupDate).toBeGreaterThanOrEqual(now)
  })
  it('should set shouldShowBackupOverlay to false', () => {
    useSettingsStore.getState().updateFileBackupDate()
    expect(useSettingsStore.getState().shouldShowBackupOverlay).toBeFalsy()
  })
  it('should set showBackupReminder to false', () => {
    useSettingsStore.getState().updateFileBackupDate()
    expect(useSettingsStore.getState().showBackupReminder).toBeFalsy()
  })
})

describe('settingsStore - updateSeedBackupDate', () => {
  const now = 1234567890
  jest.spyOn(Date, 'now').mockImplementation(() => now)
  it('should update lastSeedBackupDate', () => {
    useSettingsStore.getState().updateSeedBackupDate()
    expect(useSettingsStore.getState().lastSeedBackupDate).toBeGreaterThanOrEqual(now)
  })
  it('should set shouldShowBackupOverlay to false', () => {
    useSettingsStore.getState().updateSeedBackupDate()
    expect(useSettingsStore.getState().shouldShowBackupOverlay).toBeFalsy()
  })
  it('should set showBackupReminder to false', () => {
    useSettingsStore.getState().updateSeedBackupDate()
    expect(useSettingsStore.getState().showBackupReminder).toBeFalsy()
  })
})

describe('settingsStore - toggleAnalytics', () => {
  it('should toggle analytics', () => {
    useSettingsStore.getState().setEnableAnalytics(true)
    useSettingsStore.getState().toggleAnalytics()
    expect(useSettingsStore.getState().enableAnalytics).toBeFalsy()
    useSettingsStore.getState().toggleAnalytics()
    expect(useSettingsStore.getState().enableAnalytics).toBeTruthy()
  })
})

describe('settingsStore - setPayoutAddressSignature', () => {
  it('should set payoutAddressSignature', () => {
    const signature = 'signature'
    useSettingsStore.getState().setPayoutAddressSignature(signature)
    expect(useSettingsStore.getState().payoutAddressSignature).toBe(signature)
  })
})

describe('settingsStore - setCloudflareChallenge', () => {
  it('should set cloudflare challenge solution', () => {
    const cloudflareChallenge = {
      cfClearance: 'cfClearance',
      userAgent: 'userAgent',
    }
    useSettingsStore.getState().setCloudflareChallenge(cloudflareChallenge)
    expect(useSettingsStore.getState().cloudflareChallenge).toEqual(cloudflareChallenge)
  })
})
