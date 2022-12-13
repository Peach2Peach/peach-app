import { info } from '../../log'
import { contractStorage } from '../accountStorage'

export const storeContract = async (contract: Contract): Promise<void> => {
  info('storeContract - Storing contract')

  contractStorage.setMap(contract.id, contract)
}
