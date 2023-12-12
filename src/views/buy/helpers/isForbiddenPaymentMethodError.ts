import { isPaymentMethod } from '../../../utils/validation/isPaymentMethod'

export const isForbiddenPaymentMethodError = (
  errorMessage: string | null,
  errorDetails: unknown,
): errorDetails is PaymentMethod[] =>
  errorMessage === 'FORBIDDEN' && Array.isArray(errorDetails) && errorDetails.every(isPaymentMethod)
