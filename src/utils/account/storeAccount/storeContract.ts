import { info } from '../../log'
import { contractsStorage } from '../../storage'

export const storeContract = async (contract: Contract): Promise<void> => {
  info('storeContract - Storing contract')

  contractsStorage.setMap(contract.id, contract)
}
