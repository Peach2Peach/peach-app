import { info } from '../../log'
import { contractsStorage } from '../../storage'

export const storeContracts = async (contracts: LegacyAccount['contracts']) => {
  info('storeContracts - Storing contracts', contracts.length)

  await Promise.all(contracts.map((contract) => contractsStorage.setMapAsync(contract.id, contract)))
}
