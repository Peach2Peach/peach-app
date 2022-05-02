import { account } from '../account'

/**
 * @description Method to get saved chat
 * @param id chat id
 * @returns chat
*/
export const getChat = (id: string): Chat => {
  const chat = account.chats[id]
  let messages = chat?.messages

  // TODO legacy support, remove for version 0.1.0
  if (!messages && Array.isArray(chat)) messages = chat

  if (!chat) return {
    id,
    lastSeen: new Date(),
    messages: []
  }

  messages = messages.map((message: Message) => ({
    ...message,
    date: new Date(message.date)
  }))
  return {
    id,
    lastSeen: messages[messages.length - 1].date,
    messages
  }
}
