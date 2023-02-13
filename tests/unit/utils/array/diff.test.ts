import { deepStrictEqual } from 'assert'
import { diff } from '../../../../src/utils/array'

describe('diff', () => {
  it('filters all items from array A that also exist in array B', () => {
    const arrayA1 = [1, 2, 3, 5]
    const arrayA2 = [1, 3, 5, 6]
    const expectedA = [2]
    const arrayB1 = ['a', 'b', 'd']
    const arrayB2 = ['b', 'd', 'e']
    const expectedB = ['a']
    deepStrictEqual(diff(arrayA1, arrayA2), expectedA)
    deepStrictEqual(diff(arrayB1, arrayB2), expectedB)
  })
})
