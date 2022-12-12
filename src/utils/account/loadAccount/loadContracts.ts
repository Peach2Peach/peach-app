import { error } from '../../log'
import { contractsStorage } from '../../storage'

export const loadContracts = async (): Promise<Account['contracts']> => {
  const contracts = await contractsStorage.indexer.maps.getAll()

  if (contracts) return Object.values(contracts) as Account['contracts']

  error('Could not load contracts')
  return []
}
