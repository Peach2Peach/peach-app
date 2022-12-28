import { getDateToDisplay, getTimeDiffInDays } from '../../../src/views/settings/profile/accountInfo/utils/dates'

jest.spyOn(global.Date, 'now').mockImplementation(() => new Date('03 Jan 2009').getTime())
const date1 = new Date('01 Jan 2009')
const date2 = new Date('02 Jan 2009')
const date3 = new Date('03 Jan 2009')

describe('getTimeDiffInDays', () => {
  it('should return the correct difference in days', () => {
    expect(getTimeDiffInDays(date1)).toBe(2)
    expect(getTimeDiffInDays(date2)).toBe(1)
    expect(getTimeDiffInDays(date3)).toBe(0)
  })
})

describe('getDateToDisplay', () => {
  it('should return the correct date to display', () => {
    expect(getDateToDisplay(date1)).toBe('01/01/2009 (2 days ago)')
    expect(getDateToDisplay(date2)).toBe('02/01/2009 (yesterday)')
    expect(getDateToDisplay(date3)).toBe('03/01/2009 (today)')
  })
})
