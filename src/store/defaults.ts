import { BLOCKEXPLORER } from '@env'
import { APPVERSION, MAXTRADINGAMOUNT, MINTRADINGAMOUNT } from '../constants'

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
