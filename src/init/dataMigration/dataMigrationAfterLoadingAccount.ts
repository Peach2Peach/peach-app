import { PAYMENTMETHODINFOS } from '../../constants'
import { checkSupportedPaymentMethods } from './afterLoadingAccount/checkSupportedPaymentMethods'
import { checkUsedReferralCode } from './afterLoadingAccount/checkUsedReferralCode'
import { enforcePaymentDataFormats } from './afterLoadingAccount/enforcePaymentDataFormats'
import { migratePaymentData } from './afterLoadingAccount/migratePaymentData'

export const dataMigrationAfterLoadingAccount = (account: Account) => {
  checkSupportedPaymentMethods(account.paymentData, PAYMENTMETHODINFOS)
  enforcePaymentDataFormats(account, account.paymentData)
  checkUsedReferralCode()
  migratePaymentData(account.paymentData)
}
