import RNFS from 'react-native-fs'
import { decrypt } from '../crypto/decrypt'
import { error, info } from '../log'
import { parseError } from '../result/parseError'

export const readFile = async (path: string, password?: string): Promise<string> => {
  info(password ? 'Reading encrypted file' : 'Reading file', path)
  let content = ''

  try {
    content = await RNFS.readFile(RNFS.DocumentDirectoryPath + path, 'utf8')
  } catch (e) {
    error('File could not be read', e)
    return content
  }
  try {
    if (password) content = decrypt(content, password)
  } catch (e) {
    error('File could not be decrypted', parseError(e))
  }
  return content
}
