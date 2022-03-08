import { account } from '../account'

/**
 * @description Method to check whether offer exists in account
 * @param offer the offer
 * @returns true if offer exists
 */
export const offerExists = (id: string): boolean => account.offers.some(o => o.id === id)
