import { account } from '../account'
import { storeChats } from '../account/storeAccount'
import { unique } from '../array'
import { session } from '../session'
import { getChat } from './getChat'

/**
 * @description Method to add contract to contract list
 * @param id chat room id
 * @param contract the contract
 * @param [save] if true save account
*/
export const saveChat = (id: string, chat: Partial<Chat>, save = true): Chat => {
  if (!account.chats[id]) {
    account.chats[id] = {
      lastSeen: new Date(0),
      messages: [],
      id,
      ...chat
    }
  }
  const savedChat = getChat(id)

  if (savedChat.messages.length === chat.messages?.length) {
    account.chats[id] = {
      ...savedChat,
      ...chat,
      messages: savedChat.messages
    }
  } else {
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
        .filter(unique('signature')) // signatures are unique even if the same message is being sent 2x (user intention)
        .sort((a, b) => a.date.getTime() - b.date.getTime())
    }
  }
  if (save && session.password) storeChats(account.chats, session.password)

  return account.chats[id]
}