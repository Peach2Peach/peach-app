import { checkUsedReferralCode } from './afterLoadingAccount/checkUsedReferralCode'
import { PAYMENTMETHODINFOS } from '../../constants'
import { checkSupportedPaymentMethods } from './afterLoadingAccount/checkSupportedPaymentMethods'
import { enforcePaymentDataFormats } from './afterLoadingAccount/enforcePaymentDataFormats'

export const dataMigrationAfterLoadingAccount = (account: Account) => {
  checkSupportedPaymentMethods(account.paymentData, PAYMENTMETHODINFOS)
  enforcePaymentDataFormats(account, account.paymentData)
  checkUsedReferralCode()
}
