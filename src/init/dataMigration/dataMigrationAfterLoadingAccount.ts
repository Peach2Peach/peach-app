import { PAYMENTMETHODINFOS } from '../../constants'
import { checkSupportedPaymentMethods } from './afterLoadingAccount/checkSupportedPaymentMethods'
import { checkUsedReferralCode } from './afterLoadingAccount/checkUsedReferralCode'

export const dataMigrationAfterLoadingAccount = () => {
  checkSupportedPaymentMethods(PAYMENTMETHODINFOS)
  checkUsedReferralCode()
}
