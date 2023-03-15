import { strictEqual } from 'assert'
import { padString } from '.'

describe('padString', () => {
  it('pads string to a specific length', () => {
    strictEqual(padString({ string: '1', length: 4 }), '0001')
    strictEqual(padString({ string: '1', length: 4, char: 'x' }), 'xxx1')
    strictEqual(padString({ string: '1', length: 4, char: 'x', side: 'left' }), 'xxx1')
    strictEqual(padString({ string: '1', length: 4, char: 'x', side: 'right' }), '1xxx')
  })
})
