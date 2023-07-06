import { PAYMENTCATEGORIES } from '../../constants'

export const isLocalOption = (paymentMethod: PaymentMethod) => PAYMENTCATEGORIES.nationalOption.includes(paymentMethod)
