import { getIndexedMap } from '../../storage'
import { chatStorage } from '../chatStorage'

export const loadChats = async (): Promise<Account['chats']> => (await getIndexedMap(chatStorage)) as Account['chats']
