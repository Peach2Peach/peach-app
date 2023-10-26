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
  it('should be on version 3', () => {
    expect(useSettingsStore.persist.getOptions().version).toBe(3)
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

describe('settingsStore - setLastFileBackupDate', () => {
  it('should set lastFileBackupDate', () => {
    const now = 1234567890
    useSettingsStore.getState().setLastFileBackupDate(now)
    expect(useSettingsStore.getState().lastFileBackupDate).toBe(now)
  })
})

describe('settingsStore - setPayoutAddressSignature', () => {
  it('should set payoutAddressSignature', () => {
    const signature = 'signature'
    useSettingsStore.getState().setPayoutAddressSignature(signature)
    expect(useSettingsStore.getState().payoutAddressSignature).toBe(signature)
  })
})

describe('settingsStore - togglePeachWallet', () => {
  it('should toggle peach wallet', () => {
    useSettingsStore.getState().setPeachWalletActive(true)
    useSettingsStore.getState().togglePeachWallet()
    expect(useSettingsStore.getState().peachWalletActive).toBeFalsy()
    useSettingsStore.getState().togglePeachWallet()
    expect(useSettingsStore.getState().peachWalletActive).toBeTruthy()
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
