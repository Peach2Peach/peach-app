import { readFileInChunks } from '.'

jest.mock('react-native-fs', () => ({
  read: jest.fn().mockResolvedValueOnce('this is a ')
    .mockResolvedValueOnce('really big file')
    .mockResolvedValue(''),
}))

describe('readFileInChunks', () => {
  it('should return the file content', async () => {
    const uri = 'test.txt'

    const result = await readFileInChunks(uri)
    expect(result).toBe('this is a really big file')
  })
})
