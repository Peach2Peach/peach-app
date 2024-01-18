/* eslint-disable no-magic-numbers */
import { deepStrictEqual } from 'assert'
import { unique } from './unique'

describe('unique', () => {
  it('filters duplicated items in an array', () => {
    const arrayA = [{ id: 'a' }, { id: 'b' }, { id: 'a' }, { id: 'c' }]
    const expectedA = [{ id: 'a' }, { id: 'b' }, { id: 'c' }]
    const arrayB = [1, 3, 2, 3, 4]
    const expectedB = [1, 3, 2, 4]
    const arrayC = ['a', 'c', 'c', 'b', 'd', 'a']
    const expectedC = ['a', 'c', 'b', 'd']
    deepStrictEqual(arrayA.filter(unique('id')), expectedA)
    deepStrictEqual(arrayB.filter(unique()), expectedB)
    deepStrictEqual(arrayC.filter(unique()), expectedC)
  })
})
