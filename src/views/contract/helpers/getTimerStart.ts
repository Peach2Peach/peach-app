/**
 * @description Method to determine start time for current timer
 * @param contract contract
 * @param requiredAction action required
 * @returns start time of timer
 */
export const getTimerStart = (contract: Contract, requiredAction: ContractAction): number => {
  let start = contract.creationDate

  if (requiredAction === 'kycResponse') {
    start = contract.creationDate
  } else if (requiredAction === 'makePayment') {
    start = contract.kycRequired && contract.kycResponseDate
      ? contract.kycResponseDate
      : contract.creationDate
  } else if (requiredAction === 'confirmPayment' && contract.paymentMade) {
    start = contract.paymentMade
  }

  return start.getTime()
}