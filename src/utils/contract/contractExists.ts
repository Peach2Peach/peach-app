import { account } from '../account'

export const contractExists = (id: string): boolean => account.contracts.some((c) => c.id === id)
