import { info } from '../../log'
import { chatStorage } from '../accountStorage'

export const storeChats = async (chats: Account['chats']) => {
  info('Storing chats', chats.length)

  const chatsArray = Object.keys(chats).map((key) => chats[key])

  await Promise.all(chatsArray.map((chat) => chatStorage.setMapAsync(`chat-${chat.id}`, chat)))
}
