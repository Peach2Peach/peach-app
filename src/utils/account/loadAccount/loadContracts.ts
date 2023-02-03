import { getIndexedMap } from '../../storage'
import { contractStorage } from '../contractStorage'

export const loadContracts = async (): Promise<Account['contracts']> => {
  const contracts = await getIndexedMap(contractStorage)

  return Object.values(contracts) as Account['contracts']
}
