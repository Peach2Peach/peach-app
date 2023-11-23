/* eslint-disable no-magic-numbers */
import { strictEqual } from 'assert'
import { round } from './round'

describe('round', () => {
  it('rounds values to integers', () => {
    strictEqual(round(1.348), 1)
    strictEqual(round(1.5), 2)
    strictEqual(round(1.501), 2)
    strictEqual(round(10.348), 10)
    strictEqual(round(10.501), 11)
  })

  it('rounds values to one digit after the comma', () => {
    strictEqual(round(1.348, 1), 1.3)
    strictEqual(round(1.5, 1), 1.5)
    strictEqual(round(1.501, 1), 1.5)
    strictEqual(round(10.348, 1), 10.3)
    strictEqual(round(10.501, 1), 10.5)
  })

  it('rounds values to two digits after the comma', () => {
    strictEqual(round(1.348, 2), 1.35)
    strictEqual(round(1.5, 2), 1.5)
    strictEqual(round(1.501, 2), 1.5)
    strictEqual(round(10.348, 2), 10.35)
    strictEqual(round(10.501, 2), 10.5)
  })

  it('rounds values to three and above digits after the comma', () => {
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

    strictEqual(round(10.501298740982, 9), 10.501298741)
  })

  it('rounds values to desired power of 10', () => {
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
