import { account } from '../account'

export const offerExists = (id: string): boolean => account.offers.some((o) => o.id === id)
