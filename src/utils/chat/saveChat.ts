import { account, saveAccount } from '../account'
import { session } from '../session'
import { getChat } from './getChat'

const uniqueMessages = (m: Message, index: number, self: Message[]) => self.findIndex(s =>
  s.date.getTime() === m.date.getTime() && s.message === m.message
) === index

/**
 * @description Method to add contract to contract list
 * @param contract the contract
*/
export const saveChat = (id: string, chat: Partial<Chat>): Chat => {
  if (!account.chats[id]) {
    account.chats[id] = {
      lastSeen: new Date(0),
      messages: [],
      id,
      ...chat
    }
  }

  const savedChat = getChat(id)

  account.chats[id] = {
    ...savedChat,
    ...chat,
    messages: savedChat.messages.concat(chat.messages || [])
      .filter(m => m.date)
      .map(m => ({
        ...m,
        date: new Date(m.date)
      }))
      .filter(message => message.roomId.indexOf(id) !== -1)
      .filter(uniqueMessages)
      .sort((a, b) => a.date.getTime() - b.date.getTime())
  }
  if (session.password) saveAccount(account, session.password)

  return account.chats[id]
}