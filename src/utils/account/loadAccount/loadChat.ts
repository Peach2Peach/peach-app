import { chatStorage } from '../chatStorage'

export const loadChat = async (id: Chat['id']): Promise<Chat | null> => chatStorage.getMap(id)
