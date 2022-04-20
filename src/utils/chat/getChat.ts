import { account } from '../account'

/**
 * @description Method to get saved chat
 * @param id chat id
 * @returns chat
*/
export const getChat = (id: string): Message[]|null => {
  const messages = account.chats[id]

  if (!messages) return null

  return messages.map((message: Message) => ({
    ...message,
    date: new Date(message.date)
  }))
}
