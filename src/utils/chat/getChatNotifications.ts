import { getContracts } from '../contract'
import { getContractChatNotification } from './getContractChatNotification'

/**
 * @description Method to get number of unsed messages
 * @returns unseen chat messages
 */
export const getChatNotifications = (): number => {
  const contracts = getContracts()
  return contracts
    .reduce((sum, contract) => sum + getContractChatNotification(contract), 0)
}
