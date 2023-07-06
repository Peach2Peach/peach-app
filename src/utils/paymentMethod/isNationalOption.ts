import { PAYMENTCATEGORIES } from '../../constants'

export const isNationalOption = (paymentMethod: PaymentMethod) =>
  PAYMENTCATEGORIES.nationalOption.includes(paymentMethod)
