import { PAYMENTMETHODINFOS } from '../../constants'
import { checkSupportedPaymentMethods } from './afterLoadingAccount/checkSupportedPaymentMethods'
import { checkUsedReferralCode } from './afterLoadingAccount/checkUsedReferralCode'
import { enforcePaymentDataFormats } from './afterLoadingAccount/enforcePaymentDataFormats'

export const dataMigrationAfterLoadingAccount = async (account: Account) => {
  checkSupportedPaymentMethods(account.paymentData, PAYMENTMETHODINFOS)
  enforcePaymentDataFormats(account, account.paymentData)
  checkUsedReferralCode()
}
