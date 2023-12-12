import { getEventName } from '../events/getEventName'
import i18n from '../i18n'
import { isCashTrade } from './isCashTrade'

export const getPaymentMethodName = (p: PaymentMethod) =>
  isCashTrade(p) ? getEventName(p.replace('cash.', '')) : i18n(`paymentMethod.${p}`)
