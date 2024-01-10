import analytics from '@react-native-firebase/analytics'
import perf from '@react-native-firebase/perf'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Locale } from '../../utils/i18n'
import { createPersistStorage } from '../createPersistStorage'
import { defaultSettings } from './defaultSettings'
import { getPureSettingsState } from './helpers/getPureSettingsState'
import { migrateSettings } from './helpers/migration/migrateSettings'
import { settingsStorage } from './settingsStorage'

export type SettingsStore = Settings & {
  reset: () => void
  updateSettings: (settings: Settings) => void
  getPureState: () => Settings
  setEnableAnalytics: (enableAnalytics: boolean) => void
  toggleAnalytics: () => void
  setAnalyticsPopupSeen: (analyticsPopupSeen: boolean) => void
  setRefundAddress: (refundAddress: string | undefined) => void
  setRefundAddressLabel: (refundAddressLabel: string | undefined) => void
  setPayoutAddress: (payoutAddress: string | undefined) => void
  setPayoutAddressLabel: (payoutAddressLabel: string | undefined) => void
  setPayoutAddressSignature: (payoutAddressSignature: string) => void
  setLocale: (locale: Locale) => void
  setDisplayCurrency: (displayCurrency: Currency) => void
  updateSeedBackupDate: () => void
  updateFileBackupDate: () => void
  setShowBackupReminder: (showBackupReminder: boolean) => void
  setRefundToPeachWallet: (refundToPeachWallet: boolean) => void
  setPayoutToPeachWallet: (payoutToPeachWallet: boolean) => void
  setFeeRate: (feeRate: number | 'fastestFee' | 'halfHourFee' | 'hourFee' | 'economyFee') => void
  setUsedReferralCode: (usedReferralCode: boolean) => void
  setPGPPublished: (pgpPublished: boolean) => void
  setFCMToken: (fcmToken: string) => void
  setCloudflareChallenge: (cloudflareChallenge: Settings['cloudflareChallenge']) => void
}

const storage = createPersistStorage<SettingsStore>(settingsStorage)

export const useSettingsStore = create(
  persist<SettingsStore>(
    (set, get) => ({
      ...defaultSettings,
      reset: () =>
        set((state) => ({
          ...defaultSettings,
          analyticsPopupSeen: state.analyticsPopupSeen,
          locale: state.locale,
        })),
      getPureState: () => getPureSettingsState(get()),
      updateSettings: (settings) => set({ ...settings }),
      setEnableAnalytics: (enableAnalytics) => {
        analytics().setAnalyticsCollectionEnabled(enableAnalytics)
        perf().setPerformanceCollectionEnabled(enableAnalytics)

        set({ enableAnalytics })
      },
      toggleAnalytics: () => get().setEnableAnalytics(!get().enableAnalytics),
      setAnalyticsPopupSeen: (analyticsPopupSeen) => set({ analyticsPopupSeen }),
      setRefundAddress: (refundAddress) => set({ refundAddress }),
      setRefundAddressLabel: (refundAddressLabel) => set({ refundAddressLabel }),
      setPayoutAddress: (payoutAddress) => set({ payoutAddress }),
      setPayoutAddressLabel: (payoutAddressLabel) => set({ payoutAddressLabel }),
      setPayoutAddressSignature: (payoutAddressSignature) => set({ payoutAddressSignature }),
      setLocale: (locale) => set({ locale }),
      setDisplayCurrency: (displayCurrency) => set({ displayCurrency }),
      updateFileBackupDate: () =>
        set({ lastFileBackupDate: Date.now(), shouldShowBackupOverlay: false, showBackupReminder: false }),
      updateSeedBackupDate: () =>
        set({ lastSeedBackupDate: Date.now(), shouldShowBackupOverlay: false, showBackupReminder: false }),
      setShowBackupReminder: (showBackupReminder) =>
        set({ showBackupReminder, shouldShowBackupOverlay: showBackupReminder }),
      setRefundToPeachWallet: (refundToPeachWallet) => set({ refundToPeachWallet }),
      setPayoutToPeachWallet: (payoutToPeachWallet) => set({ payoutToPeachWallet }),
      setFeeRate: (feeRate) => set({ feeRate }),
      setUsedReferralCode: (usedReferralCode) => set({ usedReferralCode }),
      setPGPPublished: (pgpPublished) => set({ pgpPublished }),
      setFCMToken: (fcmToken) => set({ fcmToken }),
      setCloudflareChallenge: (cloudflareChallenge) => set({ cloudflareChallenge }),
    }),
    {
      name: 'settings',
      version: 4,
      migrate: migrateSettings,
      storage,
    },
  ),
)
