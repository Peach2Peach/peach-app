import { error } from '../../log'
import { chatStorage } from '../accountStorage'

export const loadChats = async (): Promise<Account['chats']> => {
  const chats = await chatStorage.indexer.maps.getAll()

  if (chats) return Object.values(chats).reduce((obj, [, chat]) => {
    obj[chat.id] = chat
    return obj
  }, {}) as Account['chats']

  error('Could not load chats')
  return {}
}
