import { sortAlphabetically } from '../../../src/utils/sortAlphabetically'

describe('sortAlphabetically', () => {
  it('should sort an array of strings alphabetically', () => {
    const inputA = 'dog'
    const inputB = 'cat'

    const expectedOutput = -1

    const result = sortAlphabetically(inputA, inputB)

    expect(result).toEqual(expectedOutput)
  })

  it('should return 1 if the first string is greater than the second string', () => {
    const inputA = 'zebra'
    const inputB = 'apple'

    const expectedOutput = 1

    const result = sortAlphabetically(inputA, inputB)

    expect(result).toEqual(expectedOutput)
  })

  it('should return 0 if the two strings are equal', () => {
    const inputA = 'banana'
    const inputB = 'banana'

    const expectedOutput = 0

    const result = sortAlphabetically(inputA, inputB)

    expect(result).toEqual(expectedOutput)
  })
})
