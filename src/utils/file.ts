import { error, info } from './log'
import RNFS from './fileSystem/RNFS'
import { decrypt, encrypt } from './crypto'

/**
 * @description Method to check whether file exists
 * @param path path to file
 * @return Promise resolving true of false
 */
export const exists = async (path: string): Promise<boolean> =>
  (await RNFS.exists(RNFS.DocumentDirectoryPath + path)) as boolean

/**
 * @description Method to create directory
 * @param path path to directory
 * @return Promise
 */
export const mkdir = async (path: string): Promise<void> => await RNFS.mkdir(RNFS.DocumentDirectoryPath + path)

/**
 * @description Method to read directory
 * @param path path to directory
 * @return Promise resolving to paths of files
 */
export const readDir = async (path: string): Promise<string[]> =>
  (await RNFS.readDir(RNFS.DocumentDirectoryPath + path)).map(file => file.path.replace(RNFS.DocumentDirectoryPath, ''))

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
    content = (await RNFS.readFile(RNFS.DocumentDirectoryPath + path, 'utf8')) as string
  } catch (e) {
    error('File could not be read', e)
    return content
  }
  try {
    if (password) content = decrypt(content, password)
  } catch (e) {
    error('File could not be decrypted', e)
  }
  return content
}

/**
 * @description Method to write file
 * @param path path to file
 * @param content content to write
 * @param [password] secret
 * @returns Promise resolving to true if operation was successful
 */
export const writeFile = async (path: string, content: string, password?: string): Promise<boolean> => {
  let encrypted
  try {
    if (password) {
      encrypted = encrypt(content, password)
    } else {
      encrypted = content
    }
  } catch (e) {
    error('Data could not be encrypted', e)
    return false
  }
  try {
    await RNFS.writeFile(RNFS.DocumentDirectoryPath + path, encrypted, 'utf8')
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
    await RNFS.unlink(RNFS.DocumentDirectoryPath + path)
    return true
  } catch (e) {
    error('File could not be deleted', e)
    return false
  }
}
