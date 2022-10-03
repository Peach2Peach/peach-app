import { exists } from 'react-native-fs'
import { mkdir, writeFile } from '../../file'
import { info } from '../../log'

/**
 * @description Method to save chats
 * @param offers offers
 * @param password secret
 * @returns promise resolving to encrypted chats
 */
export const storeChats = async (chats: Account['chats'], password: string): Promise<void> => {
  info('Storing chats', chats.length)

  if (!(await exists('/peach-account-chats'))) await mkdir('/peach-account-chats')
  const chatsArray = Object.keys(chats).map((key) => chats[key])
  await Promise.all(
    chatsArray.map((chat) => writeFile(`/peach-account-chats/${chat.id}.json`, JSON.stringify(chat), password)),
  )
}
