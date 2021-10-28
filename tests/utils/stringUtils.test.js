import { strictEqual } from 'assert'
import { padString, thousands } from '../../src/utils/stringUtils'

describe('padString', () => {
  it('pads string to a specific length', async () => {
    strictEqual(padString({ string: '1', length: 4 }), '0001')
    strictEqual(padString({ string: '1', length: 4, char: 'x' }), 'xxx1')
    strictEqual(padString({ string: '1', length: 4, char: 'x', side: 'left' }), 'xxx1')
    strictEqual(padString({ string: '1', length: 4, char: 'x', side: 'right' }), '1xxx')
  })
})

describe('thousands', () => {
  it('groups a number into thousands', async () => {
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


