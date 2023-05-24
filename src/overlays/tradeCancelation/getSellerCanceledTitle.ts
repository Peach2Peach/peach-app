import i18n from '../../utils/i18n'
import { isCashTrade } from '../../utils/paymentMethod/isCashTrade'

export const getSellerCanceledTitle = (paymentMethod: PaymentMethod) =>
  i18n(isCashTrade(paymentMethod) ? 'contract.cancel.tradeCanceled' : 'contract.cancel.requestSent')
