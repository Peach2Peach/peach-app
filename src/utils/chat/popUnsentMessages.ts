import { account } from '../account'
import { getUnsentMessages } from './getUnsentMessages'

/**
 * @description Method remove and return unsent messages from chat
 * @param id chat room id
 * @returns Unsent chat messages
 */
export const popUnsentMessages = (id: Chat['id']): Message[] => {
  const chat = account.chats[id]

  if (!chat) return []

  const unsentMessages = getUnsentMessages(chat.messages)
  chat.messages = chat.messages.filter((m) => m.from !== account.publicKey || m.readBy?.length > 0)
  return unsentMessages
}
