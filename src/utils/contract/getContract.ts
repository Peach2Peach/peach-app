import { account } from '../account'

/**
 * @description Method to get saved contract
 * @param id contract id
 * @returns contract
*/
export const getContract = (id: string): Contract|null => {
  const contract = account.contracts.find(c => c.id === id)

  if (!contract) return null

  contract.buyer.creationDate = new Date(contract.buyer.creationDate)
  contract.seller.creationDate = new Date(contract.seller.creationDate)

  return contract
}
