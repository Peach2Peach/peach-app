/* eslint-disable no-magic-numbers */

import { groupChars } from './groupChars'

describe('groupChars', () => {
  it('should group characters in sets of the specified size', () => {
    expect(groupChars('1234567890', 2)).toEqual('12 34 56 78 90')
    expect(groupChars('1234567890', 3)).toEqual('1 234 567 890')
    expect(groupChars('1234567890', 4)).toEqual('12 3456 7890')
  })

  it('should handle large strings', () => {
    expect(groupChars('1234567890123456789', 3)).toEqual('1 234 567 890 123 456 789')
    expect(groupChars('1234567890123456789', 10)).toEqual('123456789 0123456789')
  })

  it('should handle strings of length less than the set size', () => {
    expect(groupChars('1234567890', 10)).toEqual('1234567890')
    expect(groupChars('1234567890', 11)).toEqual('1234567890')
  })

  it('should handle strings with non-alphanumeric characters', () => {
    expect(groupChars('1234567890!@#$%^&*()', 2)).toEqual('12 34 56 78 90 !@ #$ %^ &* ()')
    expect(groupChars('1234567890!@#$%^&*()', 3)).toEqual('12 345 678 90! @#$ %^& *()')
    expect(groupChars('1234567890!@#$%^&*()', 4)).toEqual('1234 5678 90!@ #$%^ &*()')
  })

  it('should handle empty strings', () => {
    expect(groupChars('', 2)).toEqual('')
    expect(groupChars('', 3)).toEqual('')
    expect(groupChars('', 4)).toEqual('')
  })

  it('should handle set sizes of 1', () => {
    expect(groupChars('1234567890', 1)).toEqual('1 2 3 4 5 6 7 8 9 0')
    expect(groupChars('!@#$%^&*()', 1)).toEqual('! @ # $ % ^ & * ( )')
  })

  it('should handle set sizes larger than the length of the string', () => {
    expect(groupChars('1234567890', 20)).toEqual('1234567890')
    expect(groupChars('!@#$%^&*()', 8)).toEqual('!@ #$%^&*()')
  })

  it('should handle group sizes of 0', () => {
    expect(groupChars('1234567890', 0)).toEqual('1234567890')
    expect(groupChars('!@#$%^&*()', 0)).toEqual('!@#$%^&*()')
  })

  it('should group characters in with specified delimter', () => {
    expect(groupChars('1234567890', 2, '-')).toEqual('12-34-56-78-90')
    expect(groupChars('1234567890', 3, '.')).toEqual('1.234.567.890')
    expect(groupChars('1234567890', 4, '_')).toEqual('12_3456_7890')
  })
})
