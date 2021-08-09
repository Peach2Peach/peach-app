import * as db from '../dbUtils'

interface writeFile {
  (path: string, content: number, _encoding?: string): Promise<void>;
}

/**
 * @description Web method to emulate fs writefile by using indexedDB
 * @param {string} path document path
 * @param {string} content content
 * @param {string} [_encoding] character encoding
 */
const writeFile: writeFile = async (path, content, _encoding) => {
  await db.set(path, content)
}

interface readFile {
  (path: string, _encoding?: string): Promise<string | object | null>;
}

/**
 * @description Web method to emulate fs readFile by using indexedDB
 * @param {string} path document path
 * @param {string} [_encoding] character encoding
 */
const readFile: readFile = async (path, _encoding) => await db.get(path)

export default {
  writeFile,
  readFile,
  DocumentDirectoryPath: ''
}