import { deepStrictEqual } from 'assert'
import { splitAt } from '../../../../src/utils/string'

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
