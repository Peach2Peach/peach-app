import { info } from '../../log'
import { chatsStorage } from '../../storage'

export const storeChats = async (chats: Account['chats']) => {
  info('storeChats - Storing chats', chats.length)

  await Promise.all(Object.values(chats).map((chat) => chatsStorage.setMapAsync(chat.id, chat)))
}
