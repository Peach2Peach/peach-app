import { defaultAccount } from '..'
import { exists, readDir, readFile } from '../../file'
import { error } from '../../log'
import { dateTimeReviver, parseError } from '../../system'

/**
 * @deprecated
 */
export const loadChatsFromFileSystem = async (password: string): Promise<Account['chats']> => {
  try {
    let chats: Chat[] = []

    if (await exists('/peach-account-chats')) {
      const chatFiles = await readDir('/peach-account-chats')
      const rawChats = await Promise.all(chatFiles.map((file) => readFile(file, password)))

      chats = rawChats.map((chat) => JSON.parse(chat, dateTimeReviver) as Chat)
    }

    // fallback to version 0.1.3 and below
    if (await exists('/peach-account-chats.json')) {
      const rawChats = await readFile('/peach-account-chats.json', password)
      const chatObject = JSON.parse(rawChats || '{}', dateTimeReviver) as Account['chats']
      chats = Object.keys(chatObject).map((id) => chatObject[id])
    }
    return chats.reduce((obj, chat) => {
      obj[chat.id] = chat
      return obj
    }, {} as Account['chats'])
  } catch (e) {
    error('Could not load chats', parseError(e))
    return defaultAccount.chats
  }
}
