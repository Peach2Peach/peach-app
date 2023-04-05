import { readFile } from './readFile'

const mockReadFile = jest.fn()
jest.mock('react-native-fs', () => ({
  DocumentDirectoryPath: 'DDirPath/',
  readFile: () => mockReadFile(),
}))
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
    mockReadFile.mockRejectedValueOnce(new Error('test'))
    const path = 'test.txt'

    const result = await readFile(path)
    expect(result).toBe('')
  })

  it('should handle decrypt error', async () => {
    mockReadFile.mockResolvedValueOnce('encryptedtest')
    mockDecrypt.mockImplementationOnce(() => {
      throw new Error('test')
    })
    const path = 'test.txt'
    const password = 'test'

    const result = await readFile(path, password)
    expect(result).toBe('encryptedtest')
  })

  it('should return the file content', async () => {
    mockReadFile.mockResolvedValueOnce('test')
    const path = 'test.txt'

    const result = await readFile(path)
    expect(result).toBe('test')
  })

  it('should decrypt the file content', async () => {
    mockReadFile.mockResolvedValueOnce('encryptedtest')
    mockDecrypt.mockReturnValueOnce({ toString: () => 'decryptedtest' })
    const path = 'test.txt'
    const password = 'test'

    const result = await readFile(path, password)
    expect(result).toBe('decryptedtest')
  })
})
