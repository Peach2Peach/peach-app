import { getSelectedPaymentDataIds } from '../../../../utils/account/getSelectedPaymentDataIds'
import { info } from '../../../../utils/log/info'
import { useOfferPreferences } from '../../../offerPreferenes'
import { SettingsVersion2 } from './version2'

export type SettingsVersion1 = {
  appVersion: string
  analyticsPopupSeen?: boolean
  enableAnalytics?: boolean
  locale?: string
  minBuyAmount: number
  maxBuyAmount: number
  sellAmount: number
  returnAddress?: string
  payoutAddress?: string
  payoutAddressLabel?: string
  payoutAddressSignature?: string
  derivationPath?: string
  displayCurrency: Currency
  country?: string
  meansOfPayment: MeansOfPayment
  preferredPaymentMethods: Partial<Record<PaymentMethod, PaymentData['id']>>
  premium: number
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

export const shouldMigrateToVersion2 = (
  _persistedState: unknown,
  version: number,
): _persistedState is SettingsVersion1 => version < 2

export const version1 = (migratedState: SettingsVersion1): SettingsVersion2 => {
  const { setPaymentMethods, setPremium, setBuyAmountRange, setSellAmount } = useOfferPreferences.getState()
  info('settingsStore - migrating from version 1')
  setPaymentMethods(getSelectedPaymentDataIds(migratedState.preferredPaymentMethods))
  setPremium(migratedState.premium)
  setBuyAmountRange([migratedState.minBuyAmount, migratedState.maxBuyAmount])
  setSellAmount(migratedState.sellAmount)
  useOfferPreferences.getState().setPaymentMethods(getSelectedPaymentDataIds(migratedState.preferredPaymentMethods))
  return {
    appVersion: migratedState.appVersion,
    analyticsPopupSeen: migratedState.analyticsPopupSeen,
    enableAnalytics: migratedState.enableAnalytics,
    locale: migratedState.locale,
    returnAddress: migratedState.returnAddress,
    payoutAddress: migratedState.payoutAddress,
    payoutAddressLabel: migratedState.payoutAddressLabel,
    payoutAddressSignature: migratedState.payoutAddressSignature,
    derivationPath: migratedState.derivationPath,
    displayCurrency: migratedState.displayCurrency,
    country: migratedState.country,
    pgpPublished: migratedState.pgpPublished,
    fcmToken: migratedState.fcmToken,
    lastFileBackupDate: migratedState.lastFileBackupDate,
    lastSeedBackupDate: migratedState.lastSeedBackupDate,
    showBackupReminder: migratedState.showBackupReminder,
    shouldShowBackupOverlay: migratedState.shouldShowBackupOverlay,
    peachWalletActive: migratedState.peachWalletActive,
    nodeURL: migratedState.nodeURL,
    feeRate: migratedState.feeRate,
    usedReferralCode: migratedState.usedReferralCode,
    lastBackupDate: migratedState.lastBackupDate,
  }
}
