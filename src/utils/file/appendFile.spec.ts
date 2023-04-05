import RNFS from 'react-native-fs'
import { appendFile } from '.'

const appendFileMock = jest.fn()
const writeFileMock = jest.fn()
jest.mock('react-native-fs', () => ({
  DocumentDirectoryPath: 'DDirPath/',
  appendFile: (...args: any) => appendFileMock(...args),
  readFile: jest.fn(),
  exists: jest.fn().mockResolvedValueOnce(false)
    .mockResolvedValue(true),
  writeFile: (...args: any) => writeFileMock(...args),
}))

describe('appendFile', () => {
  it('should append content to a file', async () => {
    const path = 'test.txt'
    const content = 'test'

    const wasSuccess = await appendFile(path, content)
    expect(wasSuccess).toBe(true)
    expect(appendFileMock).toHaveBeenCalledWith(RNFS.DocumentDirectoryPath + path, content, 'utf8')
  })

  it('should append content to a file with newline', async () => {
    const path = 'test.txt'
    const content = 'test'

    const wasSuccess = await appendFile(path, content, true)
    expect(wasSuccess).toBe(true)
    expect(appendFileMock).toHaveBeenCalledWith(RNFS.DocumentDirectoryPath + path, '\ntest', 'utf8')
  })

  it('should catch error', async () => {
    const path = 'test.txt'
    const content = 'test'

    appendFileMock.mockRejectedValueOnce(new Error('test'))
    const wasSuccess = await appendFile(path, content)
    expect(wasSuccess).toBe(false)
  })
})
