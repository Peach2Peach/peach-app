import { info } from '../../log'
import { chatStorage } from '../accountStorage'

export const storeChat = (chat: Chat) => {
  info('storeChat - Storing chat')

  chatStorage.setMap(chat.id, chat)
}
