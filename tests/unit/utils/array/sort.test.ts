import { deepStrictEqual } from 'assert'
import { sort } from '../../../../src/utils/array'

describe('sort', () => {
  it('sorts items in an array', () => {
    const arrayA = [5, 3, 1, 2, 4]
    const expectedA = [1, 2, 3, 4, 5]
    const arrayB = ['d', 'b', 'c', 'a']
    const expectedB = ['a', 'b', 'c', 'd']
    deepStrictEqual(arrayA.sort(sort()), expectedA)
    deepStrictEqual(arrayB.sort(sort()), expectedB)
  })
  it('sorts items by key in an array', () => {
    const arrayA = [{ id: 'd' }, { id: 'b' }, { id: 'c' }, { id: 'a' }]
    const expectedA = [{ id: 'a' }, { id: 'b' }, { id: 'c' }, { id: 'd' }]
    deepStrictEqual(arrayA.sort(sort('id')), expectedA)
  })
  it('sorts items by key in an array and prefers objects that have keys', () => {
    const arrayA = [{ id: 'd' }, { id: 'b' }, { id: 'c' }, { nid: 'a' }]
    const expectedA = [{ id: 'b' }, { id: 'c' }, { id: 'd' }, { nid: 'a' }]
    deepStrictEqual(arrayA.sort(sort('id')), expectedA)
  })
})
