import { contractsStorage } from '../../storage'

export const loadContract = async (id: Contract['id']): Promise<Contract | null> => contractsStorage.getMap(id)
