import { PAYMENTCATEGORIES } from '../../constants'

/**
 * @description Method to check whether given payment method is a local option
 * @param paymentMethod payment method id
 * @returns true if payment method is a local option
 */
export const isLocalOption = (paymentMethod: PaymentMethod) => PAYMENTCATEGORIES.localOption.includes(paymentMethod)
