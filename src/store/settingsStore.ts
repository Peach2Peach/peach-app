import analytics from '@react-native-firebase/analytics'
import perf from '@react-native-firebase/perf'
import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import { createStorage, toZustandStorage } from '../utils/storage'
import { defaultSettings } from './defaults'
import { getPureSettingsState } from './helpers/getPureSettingsState'
import { Locale } from '../utils/i18n'
import { migrateSettings } from './helpers/migration'

export type SettingsStore = Settings & {
  migrated?: boolean
  reset: () => void
  updateSettings: (settings: Settings) => void
  getPureState: () => Settings
  setMigrated: () => void
  setEnableAnalytics: (enableAnalytics: boolean) => void
  toggleAnalytics: () => void
  setAnalyticsPopupSeen: (analyticsPopupSeen: boolean) => void
  setPayoutAddress: (payoutAddress: string) => void
  setPayoutAddressLabel: (payoutAddressLabel: string) => void
  setPayoutAddressSignature: (payoutAddressSignature: string) => void
  setLocale: (locale: Locale) => void
  setDisplayCurrency: (displayCurrency: Currency) => void
  setLastSeedBackupDate: (lastSeedBackupDate: number) => void
  setLastFileBackupDate: (lastFileBackupDate: number) => void
  setShowBackupReminder: (showBackupReminder: boolean) => void
  setShouldShowBackupOverlay: (
    type: 'completedBuyOffer' | 'refundedEscrow' | 'bitcoinReceived',
    shouldShow?: boolean
  ) => void
  setPeachWalletActive: (peachWalletActive: boolean) => void
  togglePeachWallet: () => void
  setFeeRate: (feeRate: number | 'fastestFee' | 'halfHourFee' | 'hourFee' | 'economyFee') => void
  setUsedReferralCode: (usedReferralCode: boolean) => void
  setPGPPublished: (pgpPublished: boolean) => void
  setFCMToken: (fcmToken: string) => void
}

export const settingsStorage = createStorage('settings')

export const useSettingsStore = create(
  persist<SettingsStore>(
    (set, get) => ({
      ...defaultSettings,
      reset: () =>
        set((state) => ({
          ...defaultSettings,
          migrated: false,
          analyticsPopupSeen: state.analyticsPopupSeen,
          locale: state.locale,
        })),
      setMigrated: () => set({ migrated: true }),
      getPureState: () => getPureSettingsState(get()),
      updateSettings: (settings) => set({ ...settings }),
      setEnableAnalytics: (enableAnalytics) => {
        analytics().setAnalyticsCollectionEnabled(enableAnalytics)
        perf().setPerformanceCollectionEnabled(enableAnalytics)

        set((state) => ({ ...state, enableAnalytics }))
      },
      toggleAnalytics: () => get().setEnableAnalytics(!get().enableAnalytics),
      setAnalyticsPopupSeen: (analyticsPopupSeen) => set({ analyticsPopupSeen }),
      setPayoutAddress: (payoutAddress) => set({ payoutAddress }),
      setPayoutAddressLabel: (payoutAddressLabel) => set({ payoutAddressLabel }),
      setPayoutAddressSignature: (payoutAddressSignature) => set({ payoutAddressSignature }),
      setLocale: (locale) => set({ locale }),
      setDisplayCurrency: (displayCurrency) => set({ displayCurrency }),
      setLastFileBackupDate: (lastFileBackupDate) => set({ lastFileBackupDate }),
      setLastSeedBackupDate: (lastSeedBackupDate) => set({ lastSeedBackupDate }),
      setShowBackupReminder: (showBackupReminder) => set({ showBackupReminder }),
      setShouldShowBackupOverlay: (type, shouldShow) =>
        set((state) => ({ shouldShowBackupOverlay: { ...state.shouldShowBackupOverlay, [type]: shouldShow } })),
      setPeachWalletActive: (peachWalletActive) => set({ peachWalletActive }),
      togglePeachWallet: () => get().setPeachWalletActive(!get().peachWalletActive),
      setFeeRate: (feeRate) => set({ feeRate }),
      setUsedReferralCode: (usedReferralCode) => set({ usedReferralCode }),
      setPGPPublished: (pgpPublished) => set({ pgpPublished }),
      setFCMToken: (fcmToken) => set({ fcmToken }),
    }),
    {
      name: 'settings',
      version: 2,
      migrate: migrateSettings,
      storage: createJSONStorage(() => toZustandStorage(settingsStorage)),
    },
  ),
)
