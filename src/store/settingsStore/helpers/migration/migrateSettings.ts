import { SettingsStore } from '../../useSettingsStore'
import { SettingsVersion0, shouldMigrateToVersion1, version0 } from './version0'
import { SettingsVersion1, shouldMigrateToVersion2, version1 } from './version1'
import { SettingsVersion2, shouldMigrateToVersion3, version2 } from './version2'
import { SettingsVersion3, shouldMigrateToVersion4, version3 } from './version3'

export type SettingsVersion4 = {
  appVersion: string
  analyticsPopupSeen?: boolean
  enableAnalytics?: boolean
  locale?: string
  refundAddress?: string
  refundAddressLabel?: string
  refundToPeachWallet: boolean
  payoutAddress?: string
  payoutAddressLabel?: string
  payoutAddressSignature?: string
  payoutToPeachWallet: boolean
  derivationPath?: string
  displayCurrency: Currency
  country?: string
  pgpPublished?: boolean
  fcmToken?: string
  lastFileBackupDate?: number
  lastSeedBackupDate?: number
  showBackupReminder: boolean
  shouldShowBackupOverlay: boolean
  nodeURL: string
  usedReferralCode?: boolean
  cloudflareChallenge?: {
    cfClearance: string
    userAgent: string
  }
}

export const migrateSettings = (persistedState: unknown, version: number) => {
  let migratedState = persistedState as
    | SettingsVersion0
    | SettingsVersion1
    | SettingsVersion2
    | SettingsVersion3
    | SettingsVersion4
  if (shouldMigrateToVersion1(migratedState, version)) {
    migratedState = version0(migratedState)
  }
  if (shouldMigrateToVersion2(migratedState, version)) {
    migratedState = version1(migratedState)
  }
  if (shouldMigrateToVersion3(migratedState, version)) {
    migratedState = version2(migratedState)
  }
  if (shouldMigrateToVersion4(migratedState, version)) {
    migratedState = version3(migratedState)
  }

  return migratedState as SettingsStore
}
