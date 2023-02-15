import { parsePremiumToString } from '../../../../../../../src/views/sell/helpers/parsePremiumToString'

describe('parsePremiumToString', () => {
  test('returns an empty string if no premium is provided', () => {
    expect(parsePremiumToString(undefined)).toBe('')
  })

  test('returns the input string if it is not a number', () => {
    expect(parsePremiumToString('some string')).toBe('some string')
  })

  test('returns the input number as a string if it is between -21 and 21', () => {
    expect(parsePremiumToString(21)).toBe('21')
    expect(parsePremiumToString(-21)).toBe('-21')
  })

  test('returns "21" if the input number is greater than 21', () => {
    expect(parsePremiumToString(22)).toBe('21')
  })

  test('returns "-21" if the input number is less than -21', () => {
    expect(parsePremiumToString(-22)).toBe('-21')
  })

  test('returns the trimmed string representation of the input number', () => {
    expect(parsePremiumToString('      21    ')).toBe('21')
    expect(parsePremiumToString('      210    ')).toBe('21')
  })

  test('returns the trimmed string representation of the input number without leading zeros', () => {
    expect(parsePremiumToString('01')).toBe('1')
    expect(parsePremiumToString('00')).toBe('0')
    expect(parsePremiumToString('   01  ')).toBe('1')
    expect(parsePremiumToString('  00  ')).toBe('0')
  })
  test('returns empty string for 0', () => {
    expect(parsePremiumToString(0)).toBe('')
  })

  test('returns empty string for "0"', () => {
    expect(parsePremiumToString('0')).toBe('')
  })
})
