import { chatsStorage } from '../../storage'

export const loadChat = async (id: Chat['id']): Promise<Chat | null> => chatsStorage.getMap(id)
