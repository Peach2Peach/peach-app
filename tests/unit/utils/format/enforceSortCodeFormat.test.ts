import { enforceSortCodeFormat } from '../../../../src/utils/format/enforceSortCodeFormat'

describe('enforceSortCodeFormat', () => {
  it('should return empty string when input is empty string', () => {
    const result = enforceSortCodeFormat('')
    expect(result).toBe('')
  })

  it('should remove spaces', () => {
    const result = enforceSortCodeFormat('12 34 56')
    expect(result).toBe('123456')
  })

  it('should remove spaces and convert lowercase characters to uppercase', () => {
    const result = enforceSortCodeFormat('ab cd ef')
    expect(result).toBe('ABCDEF')
  })
})
