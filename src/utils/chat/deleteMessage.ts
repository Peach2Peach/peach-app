import { account } from '../account'
import { getChat } from './getChat'

export const deleteMessage = (id: string, message: Message) => {
  const savedChat = getChat(id)

  if (!savedChat) return false
  account.chats[id] = {
    ...savedChat,
    messages: savedChat.messages.filter(({ date, message: msg }) => date !== message.date && msg !== message.message),
  }

  return true
}
