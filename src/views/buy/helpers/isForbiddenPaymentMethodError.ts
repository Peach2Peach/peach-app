import { isPaymentMethod } from '../../../utils/validation'

export const isForbiddenPaymentMethodError = (
  errorMessage: string | null,
  errorDetails: unknown,
): errorDetails is PaymentMethod[] =>
  errorMessage === 'FORBIDDEN' && Array.isArray(errorDetails) && errorDetails.every(isPaymentMethod)
