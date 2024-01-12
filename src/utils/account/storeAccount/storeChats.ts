import { info } from '../../log/info'
import { chatStorage } from '../chatStorage'

export const storeChats = async (chats: Account['chats']) => {
  info('storeChats - Storing chats', chats.length)

  await Promise.all(Object.values(chats).map((chat) => chatStorage.setMapAsync(chat.id, chat)))
}
