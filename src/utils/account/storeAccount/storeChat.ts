import { info } from '../../log'
import { chatsStorage } from '../../storage'

export const storeChat = (chat: Chat) => {
  info('storeChat - Storing chat')

  chatsStorage.setMap(chat.id, chat)
}
