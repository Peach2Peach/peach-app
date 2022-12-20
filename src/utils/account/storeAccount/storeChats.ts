import { info } from '../../log'
import { chatStorage } from '../accountStorage'

export const storeChats = async (chats: Account['chats']) => {
  info('storeChats - Storing chats', chats.length)

  await Promise.all(Object.values(chats).map((chat) => chatStorage.setMapAsync(chat.id, chat)))
}
