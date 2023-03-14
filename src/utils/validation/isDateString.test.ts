import { isDateString } from '.'

describe('isDateString', () => {
  it('should return true for a valid date string', () => {
    const validDateString = '2022-02-14T15:20:00.000Z'
    expect(isDateString(validDateString)).toBe(true)
  })

  it('should return false for an invalid date string', () => {
    const invalidDateString = 'not-a-date'
    expect(isDateString(invalidDateString)).toBe(false)
  })

  it('should return false for an empty string', () => {
    const emptyString = ''
    expect(isDateString(emptyString)).toBe(false)
  })
})
