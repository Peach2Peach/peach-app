import { deepStrictEqual } from 'assert'
import { diff, intersect, sort, unique } from '../../src/utils/array'

describe('sort', () => {
  it('filters duplicated items in an array', () => {
    const arrayA = [
      { 'id': 'd' },
      { 'id': 'b' },
      { 'id': 'c' },
      { 'id': 'a' }
    ]
    const expectedA = [
      { 'id': 'a' },
      { 'id': 'b' },
      { 'id': 'c' },
      { 'id': 'd' }
    ]
    const arrayB = [5, 3, 1, 2, 4]
    const expectedB = [1, 2, 3, 4, 5]
    const arrayC = ['d', 'b', 'c', 'a']
    const expectedC = ['a', 'b', 'c', 'd']
    deepStrictEqual(arrayA.sort(sort('id')), expectedA)
    deepStrictEqual(arrayB.sort(sort()), expectedB)
    deepStrictEqual(arrayC.sort(sort()), expectedC)
  })
})

describe('unique', () => {
  it('filters duplicated items in an array', () => {
    const arrayA = [
      { 'id': 'a' },
      { 'id': 'b' },
      { 'id': 'a' },
      { 'id': 'c' }
    ]
    const expectedA = [
      { 'id': 'a' },
      { 'id': 'b' },
      { 'id': 'c' }
    ]
    const arrayB = [1, 3, 2, 3, 4]
    const expectedB = [1, 3, 2, 4]
    const arrayC = ['a', 'c', 'c', 'b', 'd', 'a']
    const expectedC = ['a', 'c', 'b', 'd']
    deepStrictEqual(arrayA.filter(unique('id')), expectedA)
    deepStrictEqual(arrayB.filter(unique()), expectedB)
    deepStrictEqual(arrayC.filter(unique()), expectedC)
  })
})

describe('intersect', () => {
  it('filters duplicated items in an array', () => {
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

describe('diff', () => {
  it('filters duplicated items in an array', () => {
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
