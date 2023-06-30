import { BLOCKEXPLORER } from '@env'
import { APPVERSION } from '../../constants'

export const defaultSettings: Settings = {
  appVersion: APPVERSION,

  enableAnalytics: false,
  analyticsPopupSeen: undefined,

  lastFileBackupDate: undefined,
  lastSeedBackupDate: undefined,
  showBackupReminder: false,
  shouldShowBackupOverlay: true,

  country: undefined,
  locale: undefined,
  displayCurrency: 'EUR',

  nodeURL: BLOCKEXPLORER,

  returnAddress: undefined,
  payoutAddress: undefined,
  payoutAddressLabel: undefined,
  payoutAddressSignature: undefined,
  peachWalletActive: true,
  derivationPath: undefined,
  feeRate: 'halfHourFee',

  pgpPublished: undefined,
  fcmToken: undefined,
  usedReferralCode: undefined,
}
