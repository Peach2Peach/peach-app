import { getIndexedMap } from '../../storage'
import { contractStorage } from '../accountStorage'

export const loadContracts = async (): Promise<Account['contracts']> => {
  const contracts = await getIndexedMap(contractStorage)

  return Object.values(contracts) as Account['contracts']
}
