import { sortByDate } from './../../../../src/views/yourTrades/hooks/useYourTradesSetup'
describe('sort by date', () => {
  it('should return 1 if a has paymentConfirmed and b doesn\'t', () => {
    const a: Partial<TradeSummary> = { paymentConfirmed: new Date('2022-01-01'), creationDate: new Date('2020-01-01') }
    const b: Partial<TradeSummary> = { creationDate: new Date('2021-01-01') }
    expect(sortByDate(a as TradeSummary, b as TradeSummary)).toEqual(1)
  })

  it('should return -1 if b has paymentConfirmed and a doesn\'t', () => {
    const a: Partial<TradeSummary> = { creationDate: new Date('2020-01-01') }
    const b: Partial<TradeSummary> = { paymentConfirmed: new Date('2022-01-01'), creationDate: new Date('2021-01-01') }
    expect(sortByDate(a as TradeSummary, b as TradeSummary)).toEqual(-1)
  })

  it('should return the difference in paymentConfirmed date if both a and b have paymentConfirmed', () => {
    const a: Partial<TradeSummary> = {
      paymentConfirmed: new Date('2021-01-01'),
      paymentMade: new Date('2021-02-01'),
    }
    const b: Partial<TradeSummary> = {
      paymentConfirmed: new Date('2022-01-01'),
      paymentMade: new Date('2021-01-01'),
    }
    expect(sortByDate(a as TradeSummary, b as TradeSummary)).toEqual(-1)
  })

  it('should return 1 if a has paymentMade and b doesn\'t', () => {
    const a: Partial<TradeSummary> = { paymentMade: new Date('2022-01-01'), creationDate: new Date('2020-01-01') }
    const b: Partial<TradeSummary> = { creationDate: new Date('2021-01-01') }
    expect(sortByDate(a as TradeSummary, b as TradeSummary)).toEqual(1)
  })

  it('should return -1 if b has paymentMade and a doesn\'t', () => {
    const a: Partial<TradeSummary> = { creationDate: new Date('2020-01-01') }
    const b: Partial<TradeSummary> = { paymentMade: new Date('2022-01-01'), creationDate: new Date('2021-01-01') }
    expect(sortByDate(a as TradeSummary, b as TradeSummary)).toEqual(-1)
  })

  it('should return the difference in paymentMade date if both a and b have paymentMade', () => {
    const a: Partial<TradeSummary> = { paymentMade: new Date('2021-01-01'), creationDate: new Date('2020-01-01') }
    const b: Partial<TradeSummary> = { paymentMade: new Date('2022-01-01'), creationDate: new Date('2021-01-01') }
    expect(sortByDate(a as TradeSummary, b as TradeSummary)).toEqual(-1)
  })

  it('should return the difference in creationDate date if both a and b have creationDate', () => {
    const a: Partial<TradeSummary> = { creationDate: new Date('2020-01-01') }
    const b: Partial<TradeSummary> = { creationDate: new Date('2021-01-01') }
    expect(sortByDate(a as TradeSummary, b as TradeSummary)).toEqual(-1)
  })
})
