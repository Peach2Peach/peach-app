import { getLevel } from './getLevel'

describe('getLevel', () => {
  const tradeTheme = {
    level: 'APP',
  } as const
  it('should return the tradeTheme level if there is no offerSummary', () => {
    const level = getLevel(tradeTheme)
    expect(level).toBe('APP')
  })
  it('should return the tradeTheme level if the offer is past', () => {
    const offerSummary = {
      tradeStatus: 'tradeCompleted',
    } as OfferSummary
    const level = getLevel(tradeTheme, offerSummary)
    expect(level).toBe('APP')
  })
  it('should return the offer level otherwise', () => {
    const offerSummary = {
      tradeStatus: 'dispute',
    } as OfferSummary
    const level = getLevel(tradeTheme, offerSummary)
    expect(level).toBe('ERROR')
  })
})
