import { info } from '../../log'
import { chatStorage } from '../chatStorage'

export const storeChat = (chat: Chat) => {
  info('storeChat - Storing chat')

  chatStorage.setMap(chat.id, chat)
}
