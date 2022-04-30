import { contractExists } from '.'
import { account, saveAccount } from '../account'
import { info } from '../log'
import { session } from '../session'

/**
 * @description Method to add contract to contract list
 * @param contract the contract
*/
export const saveContract = (contract: Contract, disableSave = false): void => {
  // info('saveContract', contract)

  if (contractExists(contract.id)) {
    const index = account.contracts.findIndex(c => c.id === contract.id)
    account.contracts[index] = {
      ...account.contracts[index],
      ...contract
    }
  } else {
    account.contracts.push(contract)
  }

  if (!disableSave && session.password) saveAccount(account, session.password)
}