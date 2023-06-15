import { info } from '../../log'
import { contractStorage } from '../contractStorage'

export const storeContract = (contract: Contract) => {
  info('storeContract - Storing contract')

  contractStorage.setMap(contract.id, contract)
}
