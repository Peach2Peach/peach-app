import { account } from '../account'
import { parseContract } from './parseContract'

/**
 * @description Method to get saved contract
 * @param id contract id
 * @returns contract
 */
export const getContract = (id: string): Contract | undefined => {
  const contract = account.contracts.find((c) => c.id === id)

  if (!contract) return undefined

  return parseContract(contract)
}
