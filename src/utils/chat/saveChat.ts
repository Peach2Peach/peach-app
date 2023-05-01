import { account } from '../account'
import { storeChat } from '../account/storeAccount'
import { unique } from '../array'
import { getChat } from './getChat'

export const saveChat = (id: string, chat: Partial<Chat>, save = true): Chat => {
  if (!account.chats[id]) {
    account.chats[id] = {
      lastSeen: new Date(0),
      messages: [],
      id,
      draftMessage: '',
      ...chat,
    }
  }
  const savedChat = getChat(id)

  account.chats[id] = {
    ...savedChat,
    ...chat,
    messages: (chat.messages || [])
      .concat(savedChat.messages)
      .filter((m) => m.date)
      .map((m) => ({
        ...m,
        date: new Date(m.date),
      }))
      .filter((message) => message.roomId.includes(id))
      .filter(unique('signature')) // signatures are unique even if the same message is being sent 2x (user intention)
      .sort((a, b) => a.date.getTime() - b.date.getTime()),
  }
  if (save) storeChat(account.chats[id])

  return account.chats[id]
}
