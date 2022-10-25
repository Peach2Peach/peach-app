import { account } from '../account'

/**
 * @description Method to get saved chat
 * @param id chat id
 * @returns chat
 */
export const getChat = (id: string): Chat => {
  const chat = account.chats[id]
  let messages = chat?.messages
  const draftMessage = chat?.draftMessage

  if (!chat || !messages || !messages.length) return {
    id,
    lastSeen: new Date(),
    messages: [],
    draftMessage,
  }

  messages = messages.map((message: Message) => ({
    ...message,
    date: new Date(message.date),
  }))
  return {
    ...chat,
    lastSeen: new Date(chat.lastSeen || 0),
    messages,
  }
}
