import { exists } from './exists'

jest.mock('react-native-fs', () => ({
  DocumentDirectoryPath: 'DDirPath/',
  exists: jest.fn().mockResolvedValueOnce(false)
    .mockResolvedValue(true),
}))

describe('exists', () => {
  it('should return false if file does not exist', async () => {
    const path = 'test.txt'

    const doesExist = await exists(path)
    expect(doesExist).toBe(false)
  })

  it('should return true if file exists', async () => {
    const path = 'test.txt'

    const doesExist = await exists(path)
    expect(doesExist).toBe(true)
  })
})
