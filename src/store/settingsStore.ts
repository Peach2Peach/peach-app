import { BLOCKEXPLORER } from '@env'
import create, { createStore } from 'zustand'
import { persist } from 'zustand/middleware'
import { APPVERSION, MAXTRADINGAMOUNT, MINTRADINGAMOUNT } from '../constants'
import { storeSettings } from '../utils/account'
import { createStorage, toZustandStorage } from '../utils/storage'

type SettingsStore = Settings & {
  updateSettings: (settings: Settings) => void
  setAppVersion: (appVersion: string) => void
  setEnableAnalytics: (enableAnalytics: boolean) => void
  setLocale: (locale: string) => void
  setMinAmount: (amount: number) => void
  setMaxAmount: (amount: number) => void
  setPayoutAddress: (payoutAddress: string) => void
  setPayoutAddressLabel: (payoutAddressLabel: string) => void
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
  setShowDisputeDisclaimer: (showDisputeDisclaimer: boolean) => void
  setPeachWalletActive: (peachWalletActive: boolean) => void
  setNodeURL: (url: string) => void
  setCustomFeeRate: (customFeeRate: number) => void
  setSelectedFeeRate: (selectedFeeRate: FeeRate) => void
}

export const defaultSettings: Settings = {
  appVersion: APPVERSION,
  displayCurrency: 'EUR',
  locale: 'en',
  minAmount: MINTRADINGAMOUNT,
  maxAmount: MAXTRADINGAMOUNT,
  preferredPaymentMethods: {},
  meansOfPayment: {},
  premium: 1.5,
  showBackupReminder: true,
  showDisputeDisclaimer: true,
  peachWalletActive: true,
  nodeURL: BLOCKEXPLORER,
  customFeeRate: 1,
  selectedFeeRate: 'halfHourFee',
}

export const settingsStorage = createStorage('settings')

export const settingsStore = createStore(
  persist<SettingsStore>(
    (set) => ({
      ...defaultSettings,
      updateSettings: (settings: Settings) => set({ ...settings }),
      setAppVersion: (appVersion: string) => set((state) => ({ ...state, appVersion })),
      setEnableAnalytics: (enableAnalytics: boolean) => set((state) => ({ ...state, enableAnalytics })),
      setLocale: (locale: string) => set((state) => ({ ...state, locale })),
      setMinAmount: (minAmount: number) => set((state) => ({ ...state, minAmount })),
      setMaxAmount: (maxAmount: number) => set((state) => ({ ...state, maxAmount })),
      setPayoutAddress: (payoutAddress: string) => set((state) => ({ ...state, payoutAddress })),
      setPayoutAddressLabel: (payoutAddressLabel: string) => set((state) => ({ ...state, payoutAddressLabel })),
      setDerivationPath: (derivationPath: string) => set((state) => ({ ...state, derivationPath })),
      setDisplayCurrency: (displayCurrency: Currency) => set((state) => ({ ...state, displayCurrency })),
      setCountry: (country: Country) => set((state) => ({ ...state, country })),
      setMeansOfPayment: (meansOfPayment: MeansOfPayment) => set((state) => ({ ...state, meansOfPayment })),
      setPreferredPaymentMethods: (preferredPaymentMethods: Settings['preferredPaymentMethods']) =>
        set((state) => ({ ...state, preferredPaymentMethods })),
      setPremium: (premium: number) => set((state) => ({ ...state, premium })),
      setKYC: (kyc: boolean) => set((state) => ({ ...state, kyc })),
      setKYCType: (kycType: KYCType) => set((state) => ({ ...state, kycType })),
      setPgpPublished: (pgpPublished: boolean) => set((state) => ({ ...state, pgpPublished })),
      setFcmToken: (fcmToken: string) => set((state) => ({ ...state, fcmToken })),
      setLastBackupDate: (lastBackupDate: number) => set((state) => ({ ...state, lastBackupDate })),
      setShowBackupReminder: (showBackupReminder: boolean) => set((state) => ({ ...state, showBackupReminder })),
      setShowDisputeDisclaimer: (showDisputeDisclaimer: boolean) =>
        set((state) => ({ ...state, showDisputeDisclaimer })),
      setPeachWalletActive: (peachWalletActive: boolean) => set((state) => ({ ...state, peachWalletActive })),
      setNodeURL: (nodeURL: string) => set((state) => ({ ...state, nodeURL })),
      setCustomFeeRate: (customFeeRate: number) => set((state) => ({ ...state, customFeeRate })),
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
