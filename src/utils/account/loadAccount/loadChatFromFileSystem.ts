import { exists, readFile } from '../../file'
import { error } from '../../log'
import { parseError } from '../../system'

/**
 * @description Method to load chat
 * @param id id of chat
 * @param password password
 * @returns Promise resolving to chats
 * @deprecated
 */
export const loadChatFromFileSystem = async (id: Chat['id'], password: string): Promise<Chat | null> => {
  try {
    if (await exists(`/peach-account-chats/${id}.json`)) {
      const rawChat = await readFile(`/peach-account-chats/${id}.json`, password)
      const chat = JSON.parse(rawChat) as Chat
      chat.lastSeen = new Date(chat.lastSeen)
      chat.messages = chat.messages.map((message) => ({
        ...message,
        date: new Date(message.date),
      }))
      return chat
    }

    return null
  } catch (e) {
    error('Could not load chat', parseError(e))
    return null
  }
}
