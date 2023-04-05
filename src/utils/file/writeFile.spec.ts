import { writeFile } from './writeFile'

const writeFileMock = jest.fn().mockResolvedValue(true)
jest.mock('react-native-fs', () => ({
  DocumentDirectoryPath: 'DDirPath/',
  writeFile: (...args: any) => writeFileMock(...args),
}))

const mockEncrypt = jest.fn(() => ({ toString: () => 'encrypted' }))
jest.mock('react-native-crypto-js', () => ({
  AES: {
    encrypt: () => mockEncrypt(),
  },
}))

describe('writeFile', () => {
  it('should handle encrypt error', async () => {
    mockEncrypt.mockImplementationOnce(() => {
      throw new Error('test')
    })
    const path = 'test.txt'
    const content = 'test'
    const password = 'test'

    const wasSuccess = await writeFile(path, content, password)
    expect(wasSuccess).toBe(false)
  })

  it('should handle write error', async () => {
    writeFileMock.mockRejectedValueOnce(new Error('test'))
    const path = 'test.txt'
    const content = 'test'
    const password = 'test'

    const wasSuccess = await writeFile(path, content, password)
    expect(wasSuccess).toBe(false)
  })

  it('should write file', async () => {
    const path = 'test.txt'
    const content = 'test'

    const wasSuccess = await writeFile(path, content)
    expect(wasSuccess).toBe(true)
  })

  it('should write encrypted file', async () => {
    const path = 'test.txt'
    const content = 'test'
    const password = 'test'

    const wasSuccess = await writeFile(path, content, password)
    expect(wasSuccess).toBe(true)
  })
})
