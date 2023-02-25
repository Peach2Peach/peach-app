import { isPaymentTimeExpired } from '../contract'

export const shouldShowPaymentTimerHasRunOut = (contract: Contract) => {
  if (contract.paymentMade || contract.canceled || contract.disputeActive || contract.disputeWinner) return false

  return isPaymentTimeExpired(contract)
}
