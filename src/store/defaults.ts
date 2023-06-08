import { BLOCKEXPLORER } from '@env'
import { APPVERSION } from '../constants'

export const defaultConfig: Config = {
  paymentMethods: [],
  peachPGPPublicKey: '',
  peachFee: 0.015,
  minAppVersion: APPVERSION,
  latestAppVersion: APPVERSION,
  minTradingAmount: 0,
  maxTradingAmount: Infinity,
  seenDisputeDisclaimer: false,
}

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

  meansOfPayment: {},
  preferredPaymentMethods: {},

  premium: 1.5,

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
