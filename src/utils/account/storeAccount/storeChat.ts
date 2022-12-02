import { exists } from 'react-native-fs'
import { mkdir, writeFile } from '../../file'
import { info } from '../../log'
import { chatStorage } from '../accountStorage'

/**
 * @description Method to save chat
 * @param chat chat
 * @param password secret
 * @returns promise resolving to encrypted chat
 */
export const storeChat = (chat: Chat) => {
  info('Storing chat')

  chatStorage.setMap(`chat-${chat.id}`, chat)
}
