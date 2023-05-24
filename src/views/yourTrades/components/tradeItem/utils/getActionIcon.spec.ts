import { getActionIcon } from './getActionIcon'

describe('getActionIcon', () => {
  it('should return undefined if the trade is past offer', () => {
    const tradeSummary = {
      tradeStatus: 'tradeCompleted',
    } as const
    const actionIcon = getActionIcon(tradeSummary, 'tradeCompleted')
    expect(actionIcon).toBe(undefined)
  })
  it('should return alertOctagon if the trade is a contract summary and has a dispute winner', () => {
    const tradeSummary = {
      tradeStatus: 'releaseEscrow',
      price: 21,
      currency: 'EUR',
      disputeWinner: 'seller',
    } as const
    const actionIcon = getActionIcon(tradeSummary, 'tradeCompleted')
    expect(actionIcon).toBe('alertOctagon')
  })
  it('should return the icon from the statusIcons object otherwise', () => {
    const tradeSummary = {
      tradeStatus: 'releaseEscrow',
    } as const
    const actionIcon = getActionIcon(tradeSummary, 'releaseEscrow')
    expect(actionIcon).toBe('upload')
  })
})
