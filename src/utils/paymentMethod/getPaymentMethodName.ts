import { getEventName } from '../events'
import i18n from '../i18n'

export const getPaymentMethodName = (p: PaymentMethod) =>
  p?.includes('cash.') ? getEventName(p.replace('cash.', '')) : i18n(`paymentMethod.${p}`)
