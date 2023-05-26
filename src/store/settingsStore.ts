import analytics from '@react-native-firebase/analytics'
import { createStore, useStore } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import { info } from '../utils/log'
import { createStorage, toZustandStorage } from '../utils/storage'
import { defaultSettings } from './defaults'
import { getPureSettingsState } from './helpers/getPureSettingsState'
import { Locale } from '../utils/i18n'

export type SettingsStore = Settings & {
  migrated?: boolean
  reset: () => void
  updateSettings: (settings: Settings) => void
  getPureState: () => Settings
  setMigrated: () => void
  setEnableAnalytics: (enableAnalytics: boolean) => void
  toggleAnalytics: () => void
  setAnalyticsPopupSeen: (analyticsPopupSeen: boolean) => void
  setMinBuyAmount: (minBuyAmount: number) => void
  setMaxBuyAmount: (maxBuyAmount: number) => void
  setSellAmount: (sellAmount: number) => void
  setPayoutAddress: (payoutAddress: string) => void
  setPayoutAddressLabel: (payoutAddressLabel: string) => void
  setPayoutAddressSignature: (payoutAddressSignature: string) => void
  setLocale: (locale: Locale) => void
  setDisplayCurrency: (displayCurrency: Currency) => void
  setMeansOfPayment: (meansOfPayment: MeansOfPayment) => void
  setPreferredPaymentMethods: (preferredPaymentMethods: Settings['preferredPaymentMethods']) => void
  setPremium: (premium: number) => void
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

export const settingsStore = createStore(
  persist<SettingsStore>(
    (set, get) => ({
      ...defaultSettings,
      reset: () =>
        set({
          ...defaultSettings,
          migrated: false,
          analyticsPopupSeen: get().analyticsPopupSeen,
          locale: get().locale,
        }),
      setMigrated: () => set({ migrated: true }),
      getPureState: () => getPureSettingsState(get()),
      updateSettings: (settings) => set({ ...settings }),
      setEnableAnalytics: (enableAnalytics) => {
        analytics().setAnalyticsCollectionEnabled(enableAnalytics)
        set((state) => ({ ...state, enableAnalytics }))
      },
      toggleAnalytics: () => get().setEnableAnalytics(!get().enableAnalytics),
      setAnalyticsPopupSeen: (analyticsPopupSeen) => set((state) => ({ ...state, analyticsPopupSeen })),
      setMinBuyAmount: (minBuyAmount) => set((state) => ({ ...state, minBuyAmount })),
      setMaxBuyAmount: (maxBuyAmount) => set((state) => ({ ...state, maxBuyAmount })),
      setSellAmount: (sellAmount) => set((state) => ({ ...state, sellAmount })),
      setPayoutAddress: (payoutAddress) => set((state) => ({ ...state, payoutAddress })),
      setPayoutAddressLabel: (payoutAddressLabel) => set((state) => ({ ...state, payoutAddressLabel })),
      setPayoutAddressSignature: (payoutAddressSignature) => set((state) => ({ ...state, payoutAddressSignature })),
      setLocale: (locale) => set((state) => ({ ...state, locale })),
      setDisplayCurrency: (displayCurrency) => set((state) => ({ ...state, displayCurrency })),
      setMeansOfPayment: (meansOfPayment) => set((state) => ({ ...state, meansOfPayment })),
      setPreferredPaymentMethods: (preferredPaymentMethods) => set((state) => ({ ...state, preferredPaymentMethods })),
      setPremium: (premium) => set((state) => ({ ...state, premium })),
      setLastFileBackupDate: (lastFileBackupDate) => set((state) => ({ ...state, lastFileBackupDate })),
      setLastSeedBackupDate: (lastSeedBackupDate) => set((state) => ({ ...state, lastSeedBackupDate })),
      setShowBackupReminder: (showBackupReminder) => set((state) => ({ ...state, showBackupReminder })),
      setShouldShowBackupOverlay: (type, shouldShow) =>
        set((state) => ({ shouldShowBackupOverlay: { ...state.shouldShowBackupOverlay, [type]: shouldShow } })),
      setPeachWalletActive: (peachWalletActive) => set((state) => ({ ...state, peachWalletActive })),
      togglePeachWallet: () => get().setPeachWalletActive(!get().peachWalletActive),
      setFeeRate: (feeRate) => set((state) => ({ ...state, feeRate })),
      setUsedReferralCode: (usedReferralCode) => set((state) => ({ ...state, usedReferralCode })),
      setPGPPublished: (pgpPublished) => set((state) => ({ ...state, pgpPublished })),
      setFCMToken: (fcmToken) => set((state) => ({ ...state, fcmToken })),
    }),
    {
      name: 'settings',
      version: 1,
      migrate: (persistedState: unknown, version: number): SettingsStore | Promise<SettingsStore> => {
        const migratedState = persistedState as SettingsStore
        if (version === 0) {
          info('settingsStore - migrating from version 0')
          // if the stored value is in version 0, we rename the field to the new name
          migratedState.lastFileBackupDate = migratedState.lastBackupDate
          delete migratedState.lastBackupDate
        }

        return migratedState
      },
      storage: createJSONStorage(() => toZustandStorage(settingsStorage)),
    },
  ),
)

export const useSettingsStore = <T>(
  selector: (state: SettingsStore) => T,
  equalityFn?: ((a: T, b: T) => boolean) | undefined,
) => useStore(settingsStore, selector, equalityFn)
