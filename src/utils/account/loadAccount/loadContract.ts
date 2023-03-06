import { contractStorage } from '../contractStorage'

export const loadContract = async (id: Contract['id']): Promise<Contract | null> => contractStorage.getMap(id)
