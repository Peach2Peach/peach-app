import { deleteFile } from './deleteFile'

jest.mock('react-native-fs', () => ({
  DocumentDirectoryPath: 'DDirPath/',
  unlink: jest.fn().mockResolvedValue(true)
    .mockRejectedValueOnce(new Error('test')),
}))

describe('deleteFile', () => {
  it('should catch error', async () => {
    const path = 'test.txt'

    const wasSuccess = await deleteFile(path)
    expect(wasSuccess).toBe(false)
  })

  it('should delete a file', async () => {
    const path = 'test.txt'

    const wasSuccess = await deleteFile(path)
    expect(wasSuccess).toBe(true)
  })
})
