import { error } from '../../log'
import { contractStorage } from '../accountStorage'

export const loadContracts = async (): Promise<Account['contracts']> => {
  const contracts = await contractStorage.indexer.maps.getAll()

  if (contracts) return Object.values(contracts).map(([, contract]) => contract) as Account['contracts']

  error('Could not load contracts')
  return []
}
