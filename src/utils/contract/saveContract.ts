import { contractExists } from '.'
import { account, saveAccount } from '../account'
import { info } from '../log'
import { session } from '../session'

/**
 * @description Method to add contract to contract list
 * @param contract the contract
*/
export const saveContract = (contract: Contract, disableSave = false): void => {
  if (typeof contract.creationDate === 'string') contract.creationDate = new Date(contract.creationDate)

  if (contractExists(contract.id)) {
    account.contracts = account.contracts.map(c => {
      if (c.id !== contract.id) return c
      return {
        ...c,
        ...contract,
        disputeResultAcknowledged: contract.disputeActive
          ? false
          : contract.disputeResultAcknowledged || c.disputeResultAcknowledged,
        disputeAcknowledgedByCounterParty: contract.disputeActive
          ? false
          : contract.disputeAcknowledgedByCounterParty || c.disputeAcknowledgedByCounterParty,
      }
    })
  } else {
    account.contracts.push(contract)
  }

  if (!disableSave && session.password) {
    info('saveContract', contract.id)
    saveAccount(account, session.password)
  }
}

/**
 * @description Method to save multiple contracts
 * @param contracts the contracts
*/
export const saveContracts = (contracts: Contract[]) => {
  info('saveContracts', contracts.length)

  contracts.map(contract => saveContract(contract, true))
}
