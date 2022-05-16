import { account, saveAccount } from '../account'
import { unique } from '../array'
import { session } from '../session'
import { getChat } from './getChat'


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
    messages: savedChat.messages.concat(chat.messages || [])
      .filter(m => m.date)
      .filter(unique('date'))
      .sort((a, b) => a.date.getTime() - b.date.getTime())
  }
  if (session.password) saveAccount(account, session.password)

  return account.chats[id]
}