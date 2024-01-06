import RNFS from 'react-native-fs'
import { error } from '../log/error'
import { exists } from './exists'
import { writeFile } from './writeFile'

export const appendFile = async (path: string, content: string, newline = false): Promise<boolean> => {
  let newFile

  if (!(await exists(path))) {
    newFile = true
    await writeFile(path, '')
  }

  try {
    await RNFS.appendFile(RNFS.DocumentDirectoryPath + path, (!newFile && newline ? '\n' : '') + content, 'utf8')
    return true
  } catch (e) {
    error('File could not be written', e)
    return false
  }
}
