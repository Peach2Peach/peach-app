import { enforcePremiumFormat } from './enforcePremiumFormat'

describe('enforcePremiumFormat', () => {
  test('returns an empty string if no premium is provided', () => {
    expect(enforcePremiumFormat(undefined)).toBe('')
  })

  test('returns the input string if it is not a number', () => {
    expect(enforcePremiumFormat('some string')).toBe('some string')
  })

  test('returns the input number as a string if it is between -21 and 21', () => {
    expect(enforcePremiumFormat(21)).toBe('21')
    expect(enforcePremiumFormat(-21)).toBe('-21')
  })

  test('returns "21" if the input number is greater than 21', () => {
    expect(enforcePremiumFormat(22)).toBe('21')
  })

  test('returns "-21" if the input number is less than -21', () => {
    expect(enforcePremiumFormat(-22)).toBe('-21')
  })

  test('returns the trimmed string representation of the input number', () => {
    expect(enforcePremiumFormat('      21    ')).toBe('21')
    expect(enforcePremiumFormat('      210    ')).toBe('21')
  })

  test('returns the trimmed string representation of the input number without leading zeros', () => {
    expect(enforcePremiumFormat('01')).toBe('1')
    expect(enforcePremiumFormat('00')).toBe('0')
    expect(enforcePremiumFormat('   01  ')).toBe('1')
    expect(enforcePremiumFormat('  00  ')).toBe('0')
  })
  test('returns empty string for 0', () => {
    expect(enforcePremiumFormat(0)).toBe('')
  })

  test('returns empty string for "0"', () => {
    expect(enforcePremiumFormat('0')).toBe('')
  })
})
