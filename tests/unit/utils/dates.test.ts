import { getDateToDisplay, getTimeDiffInDays } from '../../../src/views/settings/profile/accountInfo/utils/dates'

describe('dates', () => {
  jest.spyOn(global.Date, 'now').mockImplementation(() => new Date('03 Jan 2009').getTime())

  it('should return the correct difference in days', () => {
    const date1 = new Date('02 Jan 2009')
    const date2 = new Date('01 Jan 2009')
    const date3 = new Date('03 Jan 2009')
    expect(getTimeDiffInDays(date1)).toBe(1)
    expect(getTimeDiffInDays(date2)).toBe(2)
    expect(getTimeDiffInDays(date3)).toBe(0)
  })

  it('should return the correct date to display', () => {
    expect(getDateToDisplay('03 Jan 2009')).toBe('03/01/2009 (today)')
    expect(getDateToDisplay('02 Jan 2009')).toBe('02/01/2009 (yesterday)')
    expect(getDateToDisplay('01 Jan 2009')).toBe('01/01/2009 (2 days ago)')
  })
})
