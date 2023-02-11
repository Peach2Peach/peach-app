import { BLOCKEXPLORER } from '@env'
import { APPVERSION } from '../constants'

export const defaultConfig: Config = {
  peachPGPPublicKey: '',
  peachFee: 0.015,
  minAppVersion: APPVERSION,
  latestAppVersion: APPVERSION,
  minTradingAmount: 200000,
  maxTradingAmount: 5000000,
}

export const defaultSettings: Settings = {
  appVersion: APPVERSION,
  displayCurrency: 'EUR',
  locale: 'en',
  minAmount: defaultConfig.minTradingAmount,
  maxAmount: defaultConfig.maxTradingAmount,
  preferredPaymentMethods: {},
  meansOfPayment: {},
  showBackupReminder: true,
  showDisputeDisclaimer: true,
  peachWalletActive: true,
  nodeURL: BLOCKEXPLORER,
  customFeeRate: 1,
  selectedFeeRate: 'halfHourFee',
}
