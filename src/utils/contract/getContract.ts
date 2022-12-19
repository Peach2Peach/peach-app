import { account } from '../account'

/**
 * @description Method to get saved contract
 * @param id contract id
 * @returns contract
 */
export const getContract = (id: string): Contract | undefined => {
  const contract = account.contracts.find((c) => c.id === id)

  if (!contract) return undefined

  contract.creationDate = new Date(contract.creationDate)
  contract.buyer.creationDate = new Date(contract.buyer.creationDate)
  contract.seller.creationDate = new Date(contract.seller.creationDate)

  if (contract.kycResponseDate) contract.kycResponseDate = new Date(contract.kycResponseDate)
  if (contract.paymentMade) contract.paymentMade = new Date(contract.paymentMade)
  if (contract.paymentConfirmed) contract.paymentConfirmed = new Date(contract.paymentConfirmed)

  return contract
}
