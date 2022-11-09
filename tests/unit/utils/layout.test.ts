import { deepStrictEqual } from 'assert'
import { shortToLongHex } from '../../../src/utils/layout'

describe('shortToLongHex', () => {
  it('converts 3 digit hex colors to 6 digits', () => {
    deepStrictEqual(shortToLongHex('#000'), '#000000')
    deepStrictEqual(shortToLongHex('#0F0'), '#00FF00')
    deepStrictEqual(shortToLongHex('#F74'), '#FF7744')
  })
  it('keeps 6 digits', () => {
    deepStrictEqual(shortToLongHex('#000000'), '#000000')
    deepStrictEqual(shortToLongHex('#FF7744'), '#FF7744')
    deepStrictEqual(shortToLongHex('#F57940'), '#F57940')
  })
})
