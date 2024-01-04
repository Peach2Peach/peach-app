import RNFS from 'react-native-fs'
import { readChunkOfFile } from './readChunkOfFile'

describe('readChunkOfFile', () => {
  it('should return the file content', async () => {
    const uri = `${RNFS.DocumentDirectoryPath}test.txt`
    const chunksize = 2
    const index = 0

    RNFS.writeFile(uri, 'test', 'utf8')

    const result = await readChunkOfFile(uri, chunksize, index)
    expect(result).toBe('te')
  })
})
