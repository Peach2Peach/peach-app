import { error, info } from './log'
import RNFS from './fileSystem/RNFS'
import { decrypt, encrypt } from './crypto'

/**
 * @description Method to read file
 * @param path path to file
 * @param password secret
 * @return Promise resolving to file fontent
 */
export const readFile = async (path: string, password?: string): Promise<string> => {
  info(password ? 'Reading encrypted file' : 'Reading file')
  let content = ''

  try {
    content = await RNFS.readFile(RNFS.DocumentDirectoryPath + path, 'utf8') as string
    if (password) content = decrypt(content, password)
  } catch (e) {
    error('File could not be read', e)
  }
  return content
}

/**
 * @description Method to write file
 * @param path path to file
 * @param content content to write
 * @param password secret
 * @returns Promise resolving to true if operation was successful
 */
export const writeFile = async (path: string, content: string, password: string): Promise<boolean> => {
  try {
    if (password) content = encrypt(content, password)
    await RNFS.writeFile(RNFS.DocumentDirectoryPath + path, content, 'utf8')
    return true
  } catch (e) {
    error('File could not be written', e)
    return false
  }
}

/**
 * @description Method to delete file
 * @param path path to file
 * @returns Promise resolving to true if operation was successful
 */
export const deleteFile = async (path: string): Promise<boolean> => {
  try {
    await RNFS.unlink(RNFS.DocumentDirectoryPath + '/peach-account.json')
    return true
  } catch (e) {
    error('File could not be deleted', e)
    return false
  }
}