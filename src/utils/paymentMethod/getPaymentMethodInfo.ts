import { PAYMENTMETHODINFOS } from '../../constants'

/**
 * @description Method to get payment method info of given method id
 * @param id payment method id
 * @returns payment method info
 */
export const getPaymentMethodInfo = (id: string): PaymentMethodInfo => PAYMENTMETHODINFOS.find((p) => p.id === id)!
