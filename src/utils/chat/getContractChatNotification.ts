import { account } from '../account'
import { getChat } from './getChat'

/**
 * @description Method to get unread chat notifications from contract
 * @param contract contract
 * @returns unread chat notifications for contract
 */
export const getContractChatNotification = (contract: Contract) => {
  if (typeof contract.unreadMessages !== 'undefined') {
    return contract.unreadMessages
  }

  // legacy
  const contractChat = getChat(contract.id)
  const seenMessages = contractChat
    ? contractChat.messages.filter(m => m.readBy?.includes(account.publicKey)).length
    : 0

  return contract.messages - seenMessages
}