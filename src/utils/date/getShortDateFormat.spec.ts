import { getShortDateFormat } from './getShortDateFormat'

describe('getShortDateFormat', () => {
  it('should return today if the date is today', () => {
    const today = new Date()
    expect(getShortDateFormat(today)).toEqual('today')
  })

  it('should return yesterday if the date is yesterday', () => {
    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)
    expect(getShortDateFormat(yesterday)).toEqual('yesterday')
  })

  it('should return the date in short format if the date is not today or yesterday', () => {
    const date = new Date('2020-01-01')
    expect(getShortDateFormat(date)).toEqual('01/01/20')
  })
})
