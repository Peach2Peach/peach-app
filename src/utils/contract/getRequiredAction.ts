export const getRequiredAction = (contract: Contract | null): ContractAction => {
  if (!contract || contract.canceled) return 'none'

  if (contract.kycRequired && !contract.kycConfirmed) {
    return 'kycResponse'
  } else if (!contract.paymentMade) {
    return 'sendPayment'
  } else if (contract.paymentMade && !contract.paymentConfirmed) {
    return 'confirmPayment'
  }
  return 'none'
}
