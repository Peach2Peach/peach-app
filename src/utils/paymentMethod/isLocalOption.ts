import { PAYMENTCATEGORIES } from '../../constants'

export const isLocalOption = (paymentMethod: PaymentMethod) => PAYMENTCATEGORIES.localOption.includes(paymentMethod)
