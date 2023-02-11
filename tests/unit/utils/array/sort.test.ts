import { deepStrictEqual } from 'assert'
import { sort } from '../../../../src/utils/array'

describe('sort', () => {
  it('filters duplicated items in an array', () => {
    const arrayA = [{ id: 'd' }, { id: 'b' }, { id: 'c' }, { id: 'a' }]
    const expectedA = [{ id: 'a' }, { id: 'b' }, { id: 'c' }, { id: 'd' }]
    const arrayB = [5, 3, 1, 2, 4]
    const expectedB = [1, 2, 3, 4, 5]
    const arrayC = ['d', 'b', 'c', 'a']
    const expectedC = ['a', 'b', 'c', 'd']
    deepStrictEqual(arrayA.sort(sort('id')), expectedA)
    deepStrictEqual(arrayB.sort(sort()), expectedB)
    deepStrictEqual(arrayC.sort(sort()), expectedC)
  })
})
