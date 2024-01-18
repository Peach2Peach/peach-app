import { accountStorage } from '../../../../utils/account/accountStorage'
import { getMessageToSignForAddress } from '../../../../utils/account/getMessageToSignForAddress'
import { info } from '../../../../utils/log/info'
import { isValidBitcoinSignature } from '../../../../utils/validation/isValidBitcoinSignature'
import { getNetwork } from '../../../../utils/wallet/getNetwork'

export type SettingsVersion3 = {
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
  shouldShowBackupOverlay: boolean
  peachWalletActive: boolean
  nodeURL: string
  feeRate: number | 'fastestFee' | 'halfHourFee' | 'hourFee' | 'economyFee'
  usedReferralCode?: boolean
}

export const shouldMigrateToVersion4 = (
  _persistedState: unknown,
  version: number,
): _persistedState is SettingsVersion3 => version < 4

export const version3 = (migratedState: SettingsVersion3) => {
  info('settingsStore - migrating from version 3')
  const { payoutAddress, payoutAddressLabel, payoutAddressSignature, peachWalletActive } = migratedState
  if (payoutAddress === undefined || payoutAddressLabel === undefined) {
    return {
      ...migratedState,
      payoutToPeachWallet: true,
      refundToPeachWallet: true,
      payoutAddress: undefined,
      payoutAddressLabel: undefined,
    }
  }
  if (payoutAddressSignature === undefined) {
    return {
      ...migratedState,
      refundToPeachWallet: peachWalletActive,
      payoutToPeachWallet: true,
      refundAddress: payoutAddress,
      refundAddressLabel: payoutAddressLabel,
      payoutAddress: undefined,
      payoutAddressLabel: undefined,
    }
  }

  const publicKey = (accountStorage.getMap('identity') as Identity | undefined)?.publicKey || ''
  const message = getMessageToSignForAddress(publicKey, payoutAddress)
  const isValid = isValidBitcoinSignature({
    message,
    address: payoutAddress,
    signature: payoutAddressSignature,
    network: getNetwork(),
  })
  if (!isValid) {
    return {
      ...migratedState,
      refundAddress: payoutAddress,
      refundAddressLabel: payoutAddressLabel,
      refundToPeachWallet: peachWalletActive,
      payoutAddress: undefined,
      payoutAddressLabel: undefined,
      payoutAddressSignature: undefined,
      payoutToPeachWallet: false,
    }
  }
  return {
    ...migratedState,
    refundAddress: payoutAddress,
    refundAddressLabel: payoutAddressLabel,
    refundToPeachWallet: peachWalletActive,
    payoutToPeachWallet: peachWalletActive,
  }
}
