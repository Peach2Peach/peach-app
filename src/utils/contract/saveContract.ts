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

  if (typeof contract.creationDate === 'string') contract.creationDate = new Date(contract.creationDate)

  if (contractExists(contract.id)) {
    account.contracts = account.contracts.map(c => {
      if (c.id !== contract.id) return c
      return {
        ...c,
        ...contract
      }
    })
  } else {
    account.contracts.push(contract)
  }

  if (!disableSave && session.password) saveAccount(account, session.password)
}