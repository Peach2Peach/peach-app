import { getChat } from './getChat'

/**
 * @description Method to get unseen chat notifications from contract
 * @param contract contract
 * @returns unseen chat notifications for contract
 */
export const getContractChatNotification = (contract: Contract) => {
  const contractChat = getChat(contract.id)
  const seenMessages = contractChat
    ? contractChat.messages
      .filter(m => m.date.getTime() <= contractChat.lastSeen.getTime())
      .filter(m => m.from !== 'system')
      .length
    : 0

  return contract.messages - seenMessages
}