import { readFile } from '.'
import RNFS from 'react-native-fs'

const mockDecrypt = jest.fn()
jest.mock('react-native-crypto-js', () => ({
  AES: {
    decrypt: () => mockDecrypt(),
  },
  enc: {
    Utf8: 'utf8',
  },
}))

describe('readFile', () => {
  it('should handle readFile error', async () => {
    jest.spyOn(RNFS, 'readFile').mockRejectedValueOnce(new Error('test'))
    const path = 'test.txt'

    const result = await readFile(path)
    expect(result).toBe('')
  })

  it('should handle decrypt error', async () => {
    RNFS.writeFile(RNFS.DocumentDirectoryPath + 'test.txt', 'encryptedtest', 'utf8')
    mockDecrypt.mockImplementationOnce(() => {
      throw new Error('test')
    })
    const path = 'test.txt'
    const password = 'test'

    const result = await readFile(path, password)
    expect(result).toBe('encryptedtest')
  })

  it('should return the file content', async () => {
    RNFS.writeFile(RNFS.DocumentDirectoryPath + 'test.txt', 'test', 'utf8')

    const path = 'test.txt'

    const result = await readFile(path)
    expect(result).toBe('test')
  })

  it('should decrypt the file content', async () => {
    RNFS.writeFile(RNFS.DocumentDirectoryPath + 'test.txt', 'encryptedtest', 'utf8')

    mockDecrypt.mockReturnValueOnce({ toString: () => 'decryptedtest' })
    const path = 'test.txt'
    const password = 'test'

    const result = await readFile(path, password)
    expect(result).toBe('decryptedtest')
  })
})
