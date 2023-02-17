import { PAYMENTMETHODINFOS } from '../../constants'
import { checkSupportedPaymentMethods } from './afterLoadingAccount/checkSupportedPaymentMethods'

export const dataMigrationAfterLoadingAccount = async (account: Account) => {
  await checkSupportedPaymentMethods(account.paymentData, PAYMENTMETHODINFOS)
}
