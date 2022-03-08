import { account } from '../account'

/**
 * @description Method to check whether contract exists in account
 * @param contract the contract
 * @returns true if contract exists
 */
export const contractExists = (id: string): boolean => account.contracts.some(c => c.id === id)
