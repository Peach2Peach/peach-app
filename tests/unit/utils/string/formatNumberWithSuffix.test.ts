import { formatNumberWithSuffix } from '../../../../src/utils/string'

describe('formatNumberWithSuffix', () => {
  test('formats numbers with suffixes', () => {
    expect(formatNumberWithSuffix(500)).toBe('500')
    expect(formatNumberWithSuffix(1000)).toBe('1k')
    expect(formatNumberWithSuffix(1234)).toBe('1.2k')
    expect(formatNumberWithSuffix(1000000)).toBe('1M')
    expect(formatNumberWithSuffix(1234567)).toBe('1.2M')
  })
})
