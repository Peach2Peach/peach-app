import * as db from '../dbUtils'

interface writeFile {
  (path: string, content: string, _encoding?: string): Promise<void>
}

/**
 * @description Web method to emulate fs writefile by using indexedDB
 * @param path document path
 * @param content content
 * @param [_encoding] character encoding
 */
const writeFile: writeFile = async (path, content, _encoding) => {
  await db.set(path, content)
}

interface readFile {
  (path: string, _encoding?: string): Promise<string | object | null>
}

/**
 * @description Web method to emulate fs readFile by using indexedDB
 * @param path document path
 * @param [_encoding] character encoding
 */
const readFile: readFile = async (path, _encoding) => await db.get(path)


interface unlink {
  (path: string): Promise<void>
}

/**
 * @description Web method to emulate fs readFile by using indexedDB
 * @param path document path
 */
const unlink: unlink = async (path) => await db.remove(path)

export default {
  writeFile,
  readFile,
  unlink,
  DocumentDirectoryPath: ''
}