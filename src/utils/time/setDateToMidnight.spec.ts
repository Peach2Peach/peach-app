import { setDateToMidnight } from '.'

describe('setDateToMidnight', () => {
  it('should set the hours, minutes, seconds, and milliseconds of the date to 0', () => {
    const date = new Date('2022-11-28T12:34:56.789Z')
    expect(setDateToMidnight(date)).toEqual(new Date('2022-11-28T00:00:00.000Z'))
  })
})
