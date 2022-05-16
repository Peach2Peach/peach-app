import { account } from '../account'
import { getContract } from './getContract'

/**
  * @description Method to get saved contracts
  * @returns contracts
  */
 export const getContracts = (): Contract[] => account.contracts
 .map(o => getContract(o.id || '') as Contract)
 .filter(o => o)
 .sort((a, b) => Number(a.id) < Number(b.id) ? 1 : -1)
