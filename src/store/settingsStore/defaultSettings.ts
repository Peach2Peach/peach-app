import { BLOCKEXPLORER } from '@env'
import { APPVERSION } from '../../constants'

export const defaultSettings: Settings = {
  appVersion: APPVERSION,

  enableAnalytics: false,
  analyticsPopupSeen: undefined,

  lastBackupDate: undefined,
  lastFileBackupDate: undefined,
  lastSeedBackupDate: undefined,
  showBackupReminder: false,
  shouldShowBackupOverlay: {
    completedBuyOffer: true,
    refundedEscrow: true,
    bitcoinReceived: true,
  },

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
