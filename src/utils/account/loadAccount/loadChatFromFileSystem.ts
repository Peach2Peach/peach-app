import { exists, readFile } from '../../file'
import { error } from '../../log'
import { dateTimeReviver, parseError } from '../../system'

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
      const chat = JSON.parse(rawChat, dateTimeReviver) as Chat
      return chat
    }

    return null
  } catch (e) {
    error('Could not load chat', parseError(e))
    return null
  }
}
