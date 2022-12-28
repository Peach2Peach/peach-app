/* eslint-disable no-loss-of-precision */
import { getNumberFormatParts } from '../../../../src/utils/string'

describe('getNumberFormatParts', () => {
  it('should convert numbers to number string parts with precision of 8 decimals after the comma', () => {
    expect(getNumberFormatParts(1)).toEqual(['1', '', '00 000 000'])
    expect(getNumberFormatParts(1.12345)).toEqual(['1', '', '12 345 000'])
    expect(getNumberFormatParts(0.12345678)).toEqual(['0', '', '12 345 678'])
    expect(getNumberFormatParts(10.12345678)).toEqual(['10', '', '12 345 678'])
  })
  it('should handle negative numbers', () => {
    expect(getNumberFormatParts(-1)).toEqual(['-1', '', '00 000 000'])
    expect(getNumberFormatParts(-1.12345)).toEqual(['-1', '', '12 345 000'])
    expect(getNumberFormatParts(-0.12345678)).toEqual(['-0', '', '12 345 678'])
    expect(getNumberFormatParts(-10.12345678)).toEqual(['-10', '', '12 345 678'])
  })

  it('should handle very large numbers', () => {
    expect(getNumberFormatParts(1234567890)).toEqual(['1 234 567 890', '', '00 000 000'])
    expect(getNumberFormatParts(1234567890123456)).toEqual(['1 234 567 890 123 456', '', '00 000 000'])
  })

  it('should handle numbers with more than 8 decimals after the comma', () => {
    expect(getNumberFormatParts(1.123456789)).toEqual(['1', '', '12 345 679'])
    expect(getNumberFormatParts(0.12345678901)).toEqual(['0', '', '12 345 679'])
    expect(getNumberFormatParts(10.12345678901)).toEqual(['10', '', '12 345 679'])
  })
})
