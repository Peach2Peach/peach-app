import { getIndexedMap } from '../../storage'
import { chatStorage } from '../accountStorage'

export const loadChats = async (): Promise<Account['chats']> => (await getIndexedMap(chatStorage)) as Account['chats']
