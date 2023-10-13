import { getActionIcon } from './getActionIcon'

describe('getActionIcon', () => {
  it('should return undefined if the trade is past offer', () => {
    const tradeSummary = {
      tradeStatus: 'tradeCompleted',
    } as const
    const actionIcon = getActionIcon(tradeSummary, false)
    expect(actionIcon).toBe(undefined)
  })
  it('should return sell if the trade is a contract summary and has a dispute winner', () => {
    const tradeSummary = {
      tradeStatus: 'releaseEscrow',
      price: 21,
      currency: 'EUR',
      disputeWinner: 'seller',
    } as const
    const actionIcon = getActionIcon(tradeSummary, false)
    expect(actionIcon).toBe('sell')
  })
  it('should return the icon from the statusIcons object otherwise', () => {
    const tradeSummary = {
      tradeStatus: 'releaseEscrow',
    } as const
    const actionIcon = getActionIcon(tradeSummary, false)
    expect(actionIcon).toBe('upload')
  })
})
