/**
 * @description Method to determine required action based on contract data
 * @param contract contract
 * @returns required action on contract
 */
export const getRequiredAction = (contract: Contract|null): ContractAction => {
  if (!contract || contract.canceled) return 'none'

  if (contract.kycRequired && !contract.kycConfirmed) {
    return 'kycResponse'
  } else if (!contract.paymentMade) {
    return 'makePayment'
  } else if (contract.paymentMade && !contract.paymentConfirmed) {
    return 'confirmPayment'
  }
  return 'none'
}