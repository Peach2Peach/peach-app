import create, { createStore } from 'zustand'
import { persist } from 'zustand/middleware'
import { storeSettings } from '../utils/account'
import { createStorage, toZustandStorage } from '../utils/storage'
import { defaultSettings } from './defaults'

type SettingsStore = Settings & {
  updateSettings: (settings: Settings) => void
  setAppVersion: (appVersion: string) => void
  setEnableAnalytics: (enableAnalytics: boolean) => void
  setLocale: (locale: string) => void
  setMinAmount: (amount: number) => void
  setMaxAmount: (amount: number) => void
  setPayoutAddress: (payoutAddress: string) => void
  setPayoutAddressLabel: (payoutAddressLabel: string) => void
  setPayoutAddressSignature: (payoutAddressSignature: string) => void
  setDerivationPath: (derivationPath: string) => void
  setDisplayCurrency: (displayCurrency: Currency) => void
  setCountry: (country: Country) => void
  setMeansOfPayment: (meansOfPayment: MeansOfPayment) => void
  setPreferredPaymentMethods: (preferredPaymentMethods: Settings['preferredPaymentMethods']) => void
  setPremium: (premium: number) => void
  setKyc: (kyc: boolean) => void
  setKycType: (kycType: KYCType) => void
  setPgpPublished: (pgpPublished: boolean) => void
  setFcmToken: (fcmToken: string) => void
  setLastBackupDate: (lastBackupDate: number) => void
  setShowBackupReminder: (showBackupReminder: boolean) => void
  setShowDisputeDisclaimer: (showDisputeDisclaimer: boolean) => void
  setPeachWalletActive: (peachWalletActive: boolean) => void
  setNodeURL: (url: string) => void
  setCustomFeeRate: (customFeeRate: number) => void
  setSelectedFeeRate: (selectedFeeRate: FeeRate) => void
}

export const settingsStorage = createStorage('settings')

export const settingsStore = createStore(
  persist<SettingsStore>(
    (set) => ({
      ...defaultSettings,
      updateSettings: (settings) => set({ ...settings }),
      setAppVersion: (appVersion) => set((state) => ({ ...state, appVersion })),
      setEnableAnalytics: (enableAnalytics) => set((state) => ({ ...state, enableAnalytics })),
      setLocale: (locale) => set((state) => ({ ...state, locale })),
      setMinAmount: (minAmount) => set((state) => ({ ...state, minAmount })),
      setMaxAmount: (maxAmount) => set((state) => ({ ...state, maxAmount })),
      setPayoutAddress: (payoutAddress) => set((state) => ({ ...state, payoutAddress })),
      setPayoutAddressLabel: (payoutAddressLabel) => set((state) => ({ ...state, payoutAddressLabel })),
      setPayoutAddressSignature: (payoutAddressSignature) => set((state) => ({ ...state, payoutAddressSignature })),
      setDerivationPath: (derivationPath) => set((state) => ({ ...state, derivationPath })),
      setDisplayCurrency: (displayCurrency: Currency) => set((state) => ({ ...state, displayCurrency })),
      setCountry: (country) => set((state) => ({ ...state, country })),
      setMeansOfPayment: (meansOfPayment: MeansOfPayment) => set((state) => ({ ...state, meansOfPayment })),
      setPreferredPaymentMethods: (preferredPaymentMethods: Settings['preferredPaymentMethods']) =>
        set((state) => ({ ...state, preferredPaymentMethods })),
      setPremium: (premium) => set((state) => ({ ...state, premium })),
      setKyc: (kyc) => set((state) => ({ ...state, kyc })),
      setKycType: (kycType) => set((state) => ({ ...state, kycType })),
      setPgpPublished: (pgpPublished) => set((state) => ({ ...state, pgpPublished })),
      setFcmToken: (fcmToken) => set((state) => ({ ...state, fcmToken })),
      setLastBackupDate: (lastBackupDate) => set((state) => ({ ...state, lastBackupDate })),
      setShowBackupReminder: (showBackupReminder) => set((state) => ({ ...state, showBackupReminder })),
      setShowDisputeDisclaimer: (showDisputeDisclaimer) => set((state) => ({ ...state, showDisputeDisclaimer })),
      setPeachWalletActive: (peachWalletActive) => set((state) => ({ ...state, peachWalletActive })),
      setNodeURL: (nodeURL) => set((state) => ({ ...state, nodeURL })),
      setCustomFeeRate: (customFeeRate) => set((state) => ({ ...state, customFeeRate })),
      setSelectedFeeRate: (selectedFeeRate: FeeRate) => set((state) => ({ ...state, selectedFeeRate })),
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
  storeSettings(cleanState)
})

export const useSettingsStore = create(settingsStore)
