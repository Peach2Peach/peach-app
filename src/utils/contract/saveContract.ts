import { getSummaryFromContract } from './getSummaryFromContract'
import { tradeSummaryStore } from './../../store/tradeSummaryStore'
import { contractExists } from '.'
import { account } from '../account'
import { storeContract } from '../account/storeAccount'
import { info } from '../log'

/**
 * @description Method to add contract to contract list
 * @param contract the contract
 */
export const saveContract = (contract: Contract, disableSave = false): void => {
  if (contractExists(contract.id)) {
    account.contracts = account.contracts.map((c) => {
      if (c.id !== contract.id) return c
      return {
        ...c,
        ...contract,
        disputeResultAcknowledged: contract.disputeActive
          ? false
          : contract.disputeResultAcknowledged || c.disputeResultAcknowledged,
        disputeAcknowledgedByCounterParty: !contract.disputeActive
          ? false
          : contract.disputeAcknowledgedByCounterParty || c.disputeAcknowledgedByCounterParty,
      }
    })
  } else {
    account.contracts.push(contract)
  }

  if (!disableSave) {
    info('saveContract', contract.id)
    storeContract(contract)
  }
  tradeSummaryStore.getState().setContract(contract.id, getSummaryFromContract(contract))
}

/**
 * @description Method to save multiple contracts
 * @param contracts the contracts
 */
export const saveContracts = (contracts: Contract[]) => {
  info('saveContracts', contracts.length)

  contracts.map((contract) => saveContract(contract, true))
}
