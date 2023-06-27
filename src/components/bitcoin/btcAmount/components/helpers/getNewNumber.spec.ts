import { getNewNumber } from './getNewNumber'

describe('getNewNumber', () => {
  it('should return the correct values', () => {
    const result = getNewNumber(100000000)
    expect(result).toEqual(['1', '.', '0', '0', ' ', '0', '0', '0', ' ', '0', '0', '0'])
  })
})
