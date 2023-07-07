import { getCurrencyTypeFilter } from './getCurrencyTypeFilter'

describe('getCurrencyTypeFilter', () => {
  it('should return true if type is "europe" and currency is not "USDT"', () => {
    const filter = getCurrencyTypeFilter('europe')
    expect(filter('EUR')).toBe(true)
    expect(filter('USDT')).toBe(false)
  })
  it('should return true if type is "other" and currency is "USDT"', () => {
    const filter = getCurrencyTypeFilter('other')
    expect(filter('EUR')).toBe(false)
    expect(filter('USDT')).toBe(true)
  })
})
