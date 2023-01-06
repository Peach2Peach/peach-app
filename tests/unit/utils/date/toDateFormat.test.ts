import { MSINADAY } from '../../../../src/constants'
import { toDateFormat } from '../../../../src/utils/date'

describe('toDateFormat', () => {
  it('should format the date as "today" if it is the current date', () => {
    const today = new Date()
    expect(toDateFormat(today)).toEqual('today')
  })

  it('should format the date as "yesterday" if it is the previous day', () => {
    const yesterday = new Date(new Date().getTime() - MSINADAY)
    expect(toDateFormat(yesterday)).toEqual('yesterday')
  })

  it('should format the date as "month day, year" if it is not today or yesterday', () => {
    const date = new Date('2022-11-28')
    expect(toDateFormat(date)).toEqual('nov 28th, 2022')
  })

  it('should handle dates in the future', () => {
    const futureDate = new Date('2104-12-01 ')
    expect(toDateFormat(futureDate)).toEqual('dec 1st, 2104')
  })
})
