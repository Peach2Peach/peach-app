import { dateTimeReviver } from './dateTimeReviver'

describe('dateTimeReviver', () => {
  it('returns null if passed null', () => {
    expect(dateTimeReviver('', null)).toBeNull()
  })

  it('returns the value unchanged if not a string', () => {
    expect(dateTimeReviver('', 123)).toBe(123)
    expect(dateTimeReviver('', false)).toBe(false)
    expect(dateTimeReviver('', true)).toBe(true)
    expect(dateTimeReviver('', [])).toEqual([])
    expect(dateTimeReviver('', {})).toEqual({})
  })

  it('returns a date object if passed an ISO 8601 string', () => {
    expect(dateTimeReviver('', '2022-02-13T16:23:45.678Z')).toEqual(new Date('2022-02-13T16:23:45.678Z'))
  })

  it('returns the value unchanged if passed an invalid date string', () => {
    expect(dateTimeReviver('', 'not a date')).toBe('not a date')
  })

  it('should parse date strings in JSON to Date objects', () => {
    const jsonString = `{
      "dateString": "2022-02-14T12:00:00.000Z",
      "number": 123,
      "string": "not a date string"
    }`
    const expectedOutput = {
      dateString: new Date('2022-02-14T12:00:00.000Z'),
      number: 123,
      string: 'not a date string',
    }
    const parsedJson = JSON.parse(jsonString, dateTimeReviver)
    expect(parsedJson).toEqual(expectedOutput)
  })
})
