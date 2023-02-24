import analytics from '@react-native-firebase/analytics'
import create, { createStore } from 'zustand'
import { persist } from 'zustand/middleware'
import { updateSettings } from '../utils/account'
import { Country } from '../utils/country/countryMap'
import { createStorage, toZustandStorage } from '../utils/storage'
import { defaultSettings } from './defaults'

type SettingsStore = Settings & {
  updateSettings: (settings: Settings) => void
  setAppVersion: (appVersion: string) => void
  setEnableAnalytics: (enableAnalytics: boolean) => void
  toggleAnalytics: () => void
  setAnalyticsPopupSeen: (analyticsPopupSeen: boolean) => void
  setLocale: (locale: string) => void
  setMinBuyAmount: (minBuyAmount: number) => void
  setMaxBuyAmount: (maxBuyAmount: number) => void
  setSellAmount: (sellAmount: number) => void
  setPayoutAddress: (payoutAddress: string) => void
  setPayoutAddressLabel: (payoutAddressLabel: string) => void
  setPayoutAddressSignature: (payoutAddressSignature: string) => void
  setDerivationPath: (derivationPath: string) => void
  setDisplayCurrency: (displayCurrency: Currency) => void
  setCountry: (country: Country) => void
  setMeansOfPayment: (meansOfPayment: MeansOfPayment) => void
  setPreferredPaymentMethods: (preferredPaymentMethods: Settings['preferredPaymentMethods']) => void
  setPremium: (premium: number) => void
  setKYC: (kyc: boolean) => void
  setKYCType: (kycType: KYCType) => void
  setPgpPublished: (pgpPublished: boolean) => void
  setFcmToken: (fcmToken: string) => void
  setLastBackupDate: (lastBackupDate: number) => void
  setShowBackupReminder: (showBackupReminder: boolean) => void
  setPeachWalletActive: (peachWalletActive: boolean) => void
  togglePeachWallet: () => void
  setNodeURL: (url: string) => void
  setFeeRate: (feeRate: number | 'fastestFee' | 'halfHourFee' | 'hourFee' | 'economyFee') => void
}

export const settingsStorage = createStorage('settings')

export const settingsStore = createStore(
  persist<SettingsStore>(
    (set, get) => ({
      ...defaultSettings,
      updateSettings: (settings) => set({ ...settings }),
      setAppVersion: (appVersion) => set((state) => ({ ...state, appVersion })),
      setEnableAnalytics: (enableAnalytics) => {
        analytics().setAnalyticsCollectionEnabled(enableAnalytics)
        set((state) => ({ ...state, enableAnalytics }))
      },
      toggleAnalytics: () => get().setEnableAnalytics(!get().enableAnalytics),
      setAnalyticsPopupSeen: (analyticsPopupSeen) => set((state) => ({ ...state, analyticsPopupSeen })),
      setLocale: (locale) => set((state) => ({ ...state, locale })),
      setMinBuyAmount: (minBuyAmount) => set((state) => ({ ...state, minBuyAmount })),
      setMaxBuyAmount: (maxBuyAmount) => set((state) => ({ ...state, maxBuyAmount })),
      setSellAmount: (sellAmount) => set((state) => ({ ...state, sellAmount })),
      setPayoutAddress: (payoutAddress) => set((state) => ({ ...state, payoutAddress })),
      setPayoutAddressLabel: (payoutAddressLabel) => set((state) => ({ ...state, payoutAddressLabel })),
      setPayoutAddressSignature: (payoutAddressSignature) => set((state) => ({ ...state, payoutAddressSignature })),
      setDerivationPath: (derivationPath) => set((state) => ({ ...state, derivationPath })),
      setDisplayCurrency: (displayCurrency: Currency) => set((state) => ({ ...state, displayCurrency })),
      setCountry: (country: PaymentMethodCountry) => set((state) => ({ ...state, country })),
      setMeansOfPayment: (meansOfPayment) => set((state) => ({ ...state, meansOfPayment })),
      setPreferredPaymentMethods: (preferredPaymentMethods) => set((state) => ({ ...state, preferredPaymentMethods })),
      setPremium: (premium) => set((state) => ({ ...state, premium })),
      setKYC: (kyc) => set((state) => ({ ...state, kyc })),
      setKYCType: (kycType) => set((state) => ({ ...state, kycType })),
      setPgpPublished: (pgpPublished) => set((state) => ({ ...state, pgpPublished })),
      setFcmToken: (fcmToken) => set((state) => ({ ...state, fcmToken })),
      setLastBackupDate: (lastBackupDate) => set((state) => ({ ...state, lastBackupDate })),
      setShowBackupReminder: (showBackupReminder) => set((state) => ({ ...state, showBackupReminder })),
      setPeachWalletActive: (peachWalletActive) => set((state) => ({ ...state, peachWalletActive })),
      togglePeachWallet: () => get().setPeachWalletActive(!get().peachWalletActive),
      setNodeURL: (nodeURL) => set((state) => ({ ...state, nodeURL })),
      setFeeRate: (feeRate) => set((state) => ({ ...state, feeRate })),
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

export const useSettingsStore = create(settingsStore)
