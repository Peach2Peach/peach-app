import { deepStrictEqual } from 'assert'
import { intersect } from './intersect'

describe('intersect', () => {
  it('returns the intersection of two arrays', () => {
    const arrayA1 = [1, 2, 3, 5]
    const arrayA2 = [1, 3, 5, 6]
    const expectedA = [1, 3, 5]
    const arrayB1 = ['a', 'b', 'd']
    const arrayB2 = ['b', 'd', 'e']
    const expectedB = ['b', 'd']
    deepStrictEqual(intersect(arrayA1, arrayA2), expectedA)
    deepStrictEqual(intersect(arrayB1, arrayB2), expectedB)
  })
})
