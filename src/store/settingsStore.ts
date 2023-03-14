import analytics from '@react-native-firebase/analytics'
import { createStore, useStore } from 'zustand'
import { persist } from 'zustand/middleware'
import { updateSettings } from '../utils/account'
import { createStorage, toZustandStorage } from '../utils/storage'
import { defaultSettings } from './defaults'

type SettingsStore = Settings & {
  reset: () => void
  updateSettings: (settings: Settings) => void
  setEnableAnalytics: (enableAnalytics: boolean) => void
  toggleAnalytics: () => void
  setAnalyticsPopupSeen: (analyticsPopupSeen: boolean) => void
  setMinBuyAmount: (minBuyAmount: number) => void
  setMaxBuyAmount: (maxBuyAmount: number) => void
  setSellAmount: (sellAmount: number) => void
  setPayoutAddress: (payoutAddress: string) => void
  setPayoutAddressLabel: (payoutAddressLabel: string) => void
  setPayoutAddressSignature: (payoutAddressSignature: string) => void
  setDisplayCurrency: (displayCurrency: Currency) => void
  setMeansOfPayment: (meansOfPayment: MeansOfPayment) => void
  setPreferredPaymentMethods: (preferredPaymentMethods: Settings['preferredPaymentMethods']) => void
  setPremium: (premium: number) => void
  setLastBackupDate: (lastBackupDate: number) => void
  setShowBackupReminder: (showBackupReminder: boolean) => void
  setPeachWalletActive: (peachWalletActive: boolean) => void
  togglePeachWallet: () => void
  setFeeRate: (feeRate: number | 'fastestFee' | 'halfHourFee' | 'hourFee' | 'economyFee') => void
  setUsedReferralCode: (usedReferralCode: boolean) => void
}

export const settingsStorage = createStorage('settings')

export const settingsStore = createStore(
  persist<SettingsStore>(
    (set, get) => ({
      ...defaultSettings,
      reset: () => set(() => defaultSettings),
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
      setDisplayCurrency: (displayCurrency) => set((state) => ({ ...state, displayCurrency })),
      setMeansOfPayment: (meansOfPayment) => set((state) => ({ ...state, meansOfPayment })),
      setPreferredPaymentMethods: (preferredPaymentMethods) => set((state) => ({ ...state, preferredPaymentMethods })),
      setPremium: (premium) => set((state) => ({ ...state, premium })),
      setLastBackupDate: (lastBackupDate) => set((state) => ({ ...state, lastBackupDate })),
      setShowBackupReminder: (showBackupReminder) => set((state) => ({ ...state, showBackupReminder })),
      setPeachWalletActive: (peachWalletActive) => set((state) => ({ ...state, peachWalletActive })),
      togglePeachWallet: () => get().setPeachWalletActive(!get().peachWalletActive),
      setFeeRate: (feeRate) => set((state) => ({ ...state, feeRate })),
      setUsedReferralCode: (usedReferralCode) => set((state) => ({ ...state, usedReferralCode })),
    }),
    {
      name: 'settings',
      version: 0,
      getStorage: () => toZustandStorage(settingsStorage),
    },
  ),
)

settingsStore.subscribe((state) => {
  const cleanState = (Object.keys(state) as (keyof Settings)[])
    .filter((key) => typeof state[key] !== 'function')
    .reduce(
      (obj: Settings, key) => ({
        ...obj,
        [key]: state[key],
      }),
      {} as Settings,
    )
  updateSettings(cleanState, true)
})

export const useSettingsStore = <T>(
  selector: (state: SettingsStore) => T,
  equalityFn?: ((a: T, b: T) => boolean) | undefined,
) => useStore(settingsStore, selector, equalityFn)
