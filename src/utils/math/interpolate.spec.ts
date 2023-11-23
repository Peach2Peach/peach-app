/* eslint-disable no-magic-numbers */
import { strictEqual } from 'assert'
import { interpolate } from './interpolate'

describe('interpolate', () => {
  it('interpolates a number to a new range', () => {
    strictEqual(interpolate(-1, [-1, 1], [0, 5]), 0)
    strictEqual(interpolate(0, [-1, 1], [0, 5]), 2.5)
    strictEqual(interpolate(1, [-1, 1], [0, 5]), 5)
    strictEqual(interpolate(0, [0, 5], [-1, 1]), -1)
    strictEqual(interpolate(2.5, [0, 5], [-1, 1]), 0)
    strictEqual(interpolate(5, [0, 5], [-1, 1]), 1)
    strictEqual(interpolate(50000, [0, 50000], [400, 0]), 0)
    strictEqual(interpolate(0, [0, 50000], [400, 0]), 400)
    strictEqual(interpolate(25000, [0, 50000], [400, 0]), 200)
    strictEqual(interpolate(25000, [25000, 50000], [400, 0]), 400)
    strictEqual(interpolate(30000, [25000, 50000], [400, 0]), 320)
  })
})
