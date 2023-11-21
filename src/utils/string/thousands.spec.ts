/* eslint-disable no-magic-numbers */
import { strictEqual } from 'assert'
import { thousands } from './thousands'

describe('thousands', () => {
  it('groups a number into thousands with non breaking space by default', () => {
    strictEqual(thousands(1), '1')
    strictEqual(thousands(12), '12')
    strictEqual(thousands(123), '123')
    strictEqual(thousands(1234), '1 234')
    strictEqual(thousands(12345), '12 345')
    strictEqual(thousands(123456), '123 456')
    strictEqual(thousands(1234567), '1 234 567')
    strictEqual(thousands(12345678), '12 345 678')
    strictEqual(thousands(21000000), '21 000 000')
    strictEqual(thousands(100000000), '100 000 000')
  })
  it('groups a number into thousands with specified delimter', () => {
    strictEqual(thousands(1234, '-'), '1-234')
    strictEqual(thousands(100000000, ' '), '100 000 000')
    strictEqual(thousands(100000000, ','), '100,000,000')
  })
  it('groups decimals into thousands', () => {
    expect(thousands(20.1)).toBe('20.1')
    expect(thousands(1234.567)).toBe('1 234.567')
    expect(thousands(1234.567, '-')).toBe('1-234.567')
  })
})
