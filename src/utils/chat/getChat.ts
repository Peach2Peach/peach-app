import { account } from '../account'

export const getChat = (id: string): Chat => {
  const chat = account.chats[id]
  let messages = chat?.messages
  const draftMessage = chat?.draftMessage

  if (!chat || !messages) return {
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
