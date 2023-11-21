import { toDateFormat } from '.'

describe('toDateFormat', () => {
  it('should format the date as "month day, year" if it is not today or yesterday', () => {
    const date = new Date('2022-11-28')
    expect(toDateFormat(date)).toEqual('nov 28th, 2022')
  })

  it('should handle dates in the future', () => {
    const futureDate = new Date('2104-12-01 ')
    expect(toDateFormat(futureDate)).toEqual('dec 1st, 2104')
  })
})
