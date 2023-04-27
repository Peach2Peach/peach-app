import { giftCardFields } from './giftCardFields'
import { nationalTransferFields } from './nationalTransferFields'
import * as paymentMethodFields from './uniquePaymentMethodFields'

export const paymentFields: Record<PaymentMethod, (keyof PaymentData)[]> = {
  ...paymentMethodFields,
  ...giftCardFields,
  ...nationalTransferFields,
}
