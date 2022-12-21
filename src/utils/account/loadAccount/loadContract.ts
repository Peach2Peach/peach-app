import { contractStorage } from '../accountStorage'

export const loadContract = async (id: Contract['id']): Promise<Contract | null> => contractStorage.getMap(id)
