import { error } from '../../log'
import { contractsStorage } from '../../storage'

export const loadContracts = async (): Promise<Record<string, Contract>> => {
  const contracts = await contractsStorage.indexer.maps.getAll()

  if (contracts) return contracts as Record<string, Contract>

  error('Could not load contracts')
  return {}
}
