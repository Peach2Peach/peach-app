import { strictEqual } from 'assert'
import { interpolate } from '../../../../src/utils/math'

describe('interpolate', () => {
  it('interpolates a number to a new range', () => {
    strictEqual(interpolate(-1, [-1, 1], [0, 5]), 0)
    strictEqual(interpolate(0, [-1, 1], [0, 5]), 2.5)
    strictEqual(interpolate(1, [-1, 1], [0, 5]), 5)
    strictEqual(interpolate(0, [0, 5], [-1, 1]), -1)
    strictEqual(interpolate(2.5, [0, 5], [-1, 1]), 0)
    strictEqual(interpolate(5, [0, 5], [-1, 1]), 1)
  })
})
