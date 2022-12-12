import { contractStorage } from '../../storage/accountStorage'

export const loadContract = async (id: Contract['id']): Promise<Contract | null> => contractStorage.getMap(id)
