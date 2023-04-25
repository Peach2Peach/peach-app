import { getIndexedMap } from '../../storage'
import { contractStorage } from '../contractStorage'

export const loadContracts = async (): Promise<Contract[]> => {
  const contracts = await getIndexedMap(contractStorage)

  return Object.values(contracts) as Contract[]
}
