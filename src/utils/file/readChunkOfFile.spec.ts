import { readChunkOfFile } from './readChunkOfFile'

jest.mock('react-native-fs', () => ({
  read: jest.fn().mockResolvedValue('test'),
}))

describe('readChunkOfFile', () => {
  it('should return the file content', async () => {
    const uri = 'test.txt'
    const chunksize = 1
    const index = 0

    const result = await readChunkOfFile(uri, chunksize, index)
    expect(result).toBe('test')
  })
})
