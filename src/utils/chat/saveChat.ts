import { useAccountStore } from '../account/account'
import { storeChat } from '../account/storeAccount'
import { unique } from '../array/unique'
import { getChat } from './getChat'

export const saveChat = (id: string, chat: Partial<Chat>, save = true): Chat => {
  const account = useAccountStore.getState().account
  if (!account.chats[id]) {
    useAccountStore.getState().setChat(id, {
      lastSeen: new Date(0),
      messages: [],
      id,
      draftMessage: '',
      ...chat,
    })
  }
  const savedChat = getChat(id)

  useAccountStore.getState().setChat(id, {
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
      .filter(unique('signature'))
      .sort((a, b) => a.date.getTime() - b.date.getTime()),
  })

  const updatedChat = useAccountStore.getState().account.chats[id]
  if (save) storeChat(updatedChat)

  return updatedChat
}
