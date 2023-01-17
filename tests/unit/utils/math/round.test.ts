/* eslint-disable max-statements */
import { strictEqual } from 'assert'
import { round } from '../../../../src/utils/math'

describe('round', () => {
  it('rounds values to desired digits after the comma', async () => {
    strictEqual(round(1.348), 1)
    strictEqual(round(1.5), 2)
    strictEqual(round(1.501), 2)
    strictEqual(round(10.348), 10)
    strictEqual(round(10.501), 11)

    strictEqual(round(1.348, 1), 1.3)
    strictEqual(round(1.5, 1), 1.5)
    strictEqual(round(1.501, 1), 1.5)
    strictEqual(round(10.348, 1), 10.3)
    strictEqual(round(10.501, 1), 10.5)

    strictEqual(round(1.348, 2), 1.35)
    strictEqual(round(1.5, 2), 1.5)
    strictEqual(round(1.501, 2), 1.5)
    strictEqual(round(10.348, 2), 10.35)
    strictEqual(round(10.501, 2), 10.5)

    strictEqual(round(1.348, 3), 1.348)
    strictEqual(round(1.5, 3), 1.5)
    strictEqual(round(1.501, 3), 1.501)
    strictEqual(round(10.348, 3), 10.348)
    strictEqual(round(10.501, 3), 10.501)

    strictEqual(round(1.348, 4), 1.348)
    strictEqual(round(1.5, 4), 1.5)
    strictEqual(round(1.501, 4), 1.501)
    strictEqual(round(10.348, 4), 10.348)
    strictEqual(round(10.501, 4), 10.501)
  })

  it('rounds values to desired power of 10', async () => {
    strictEqual(round(1.348, -1), 0)
    strictEqual(round(5, -1), 10)
    strictEqual(round(10.348, -1), 10)
    strictEqual(round(15.348, -1), 20)
    strictEqual(round(153, -1), 150)

    strictEqual(round(1.348, -2), 0)
    strictEqual(round(5, -2), 0)
    strictEqual(round(10.348, -2), 0)
    strictEqual(round(15.348, -2), 0)
    strictEqual(round(143, -2), 100)
    strictEqual(round(153, -2), 200)
  })
})
