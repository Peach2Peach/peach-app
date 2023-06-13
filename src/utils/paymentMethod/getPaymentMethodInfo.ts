import { PAYMENTMETHODINFOS } from '../../constants'

export const getPaymentMethodInfo = (id: string): PaymentMethodInfo => PAYMENTMETHODINFOS.find((p) => p.id === id)!
