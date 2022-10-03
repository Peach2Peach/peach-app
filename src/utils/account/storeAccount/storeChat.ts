import { exists } from 'react-native-fs'
import { mkdir, writeFile } from '../../file'
import { info } from '../../log'

/**
 * @description Method to save chat
 * @param chat chat
 * @param password secret
 * @returns promise resolving to encrypted chat
 */
export const storeChat = async (chat: Chat, password: string): Promise<void> => {
  info('Storing chat')

  if (!(await exists('/peach-account-chats'))) await mkdir('/peach-account-chats')
  await writeFile(`/peach-account-chats/${chat.id}.json`, JSON.stringify(chat), password)
}
