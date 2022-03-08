import { deepStrictEqual, strictEqual } from 'assert'
import { padString, splitAt, thousands } from '../../src/utils/string'

describe('padString', () => {
  it('pads string to a specific length', () => {
    strictEqual(padString({ string: '1', length: 4 }), '0001')
    strictEqual(padString({ string: '1', length: 4, char: 'x' }), 'xxx1')
    strictEqual(padString({ string: '1', length: 4, char: 'x', side: 'left' }), 'xxx1')
    strictEqual(padString({ string: '1', length: 4, char: 'x', side: 'right' }), '1xxx')
  })
})

describe('splitAt', () => {
  it('splits a string into two at a given index', () => {
    deepStrictEqual(splitAt('abcdef', 0), ['', 'abcdef'])
    deepStrictEqual(splitAt('abcdef', 1), ['a', 'bcdef'])
    deepStrictEqual(splitAt('abcdef', 2), ['ab', 'cdef'])
    deepStrictEqual(splitAt('abcdef', 5), ['abcde', 'f'])
    deepStrictEqual(splitAt('abcdef', 6), ['abcdef', ''])
    deepStrictEqual(splitAt('abcdef', 7), ['abcdef', ''])
    deepStrictEqual(splitAt('abcdef', -1), ['abcde', 'f'])
    deepStrictEqual(splitAt('abcdef', -2), ['abcd', 'ef'])
    deepStrictEqual(splitAt('abcdef', -6), ['', 'abcdef'])
    deepStrictEqual(splitAt('abcdef', -7), ['', 'abcdef'])
  })
})

describe('thousands', () => {
  it('groups a number into thousands', () => {
    strictEqual(thousands(1), '1')
    strictEqual(thousands(12), '12')
    strictEqual(thousands(123), '123')
    strictEqual(thousands(1234), '1 234')
    strictEqual(thousands(12345), '12 345')
    strictEqual(thousands(123456), '123 456')
    strictEqual(thousands(1234567), '1 234 567')
    strictEqual(thousands(12345678), '12 345 678')
    strictEqual(thousands(21000000), '21 000 000')
    strictEqual(thousands(100000000), '100 000 000')
  })
})


