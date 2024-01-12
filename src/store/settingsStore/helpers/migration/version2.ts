import { info } from '../../../../utils/log/info'
import { SettingsVersion3 } from './version3'

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

export const shouldMigrateToVersion3 = (
  _persistedState: unknown,
  version: number,
): _persistedState is SettingsVersion2 => version < 3

export const version2 = (migratedState: SettingsVersion2): SettingsVersion3 => {
  info('settingsStore - migrating from version 2')
  delete migratedState.lastBackupDate
  return {
    ...migratedState,
    shouldShowBackupOverlay:
      migratedState.shouldShowBackupOverlay && Object.values(migratedState.shouldShowBackupOverlay).includes(true),
  }
}
