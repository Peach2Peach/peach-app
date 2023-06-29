import { SettingsStore } from '../../useSettingsStore'
import { SettingsVersion0, shouldMigrateToVersion1, version0 } from './version0'
import { SettingsVersion1, shouldMigrateToVersion2, version1 } from './version1'

export type SettingsVersion2 = {
  appVersion: string
  analyticsPopupSeen?: boolean
  enableAnalytics?: boolean
  locale?: string
  returnAddress?: string
  payoutAddress?: string
  payoutAddressLabel?: string
  payoutAddressSignature?: string
  derivationPath?: string
  displayCurrency: Currency
  country?: string
  pgpPublished?: boolean
  fcmToken?: string
  lastFileBackupDate?: number
  lastSeedBackupDate?: number
  showBackupReminder: boolean
  shouldShowBackupOverlay: {
    completedBuyOffer: boolean
    refundedEscrow: boolean
    bitcoinReceived: boolean
  }
  peachWalletActive: boolean
  nodeURL: string
  feeRate: number | 'fastestFee' | 'halfHourFee' | 'hourFee' | 'economyFee'
  usedReferralCode?: boolean
  lastBackupDate?: number
}

export const migrateSettings = (persistedState: unknown, version: number) => {
  let migratedState = persistedState as SettingsVersion0 | SettingsVersion1 | SettingsVersion2
  if (shouldMigrateToVersion1(migratedState, version)) {
    migratedState = version0(migratedState)
  }
  if (shouldMigrateToVersion2(migratedState, version)) {
    migratedState = version1(migratedState)
  }

  return migratedState as SettingsStore
}
