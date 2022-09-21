import { account } from '../account'

/**
 * @description Method to get unsent chat messages
 * @param chat chat room
 * @returns unsent chat messages
 */
export const getUnsentMessages = (chat: Chat): Message[] =>
  chat.messages.filter(m => m.from === account.publicKey).filter(m => m.readBy?.length === 0)
