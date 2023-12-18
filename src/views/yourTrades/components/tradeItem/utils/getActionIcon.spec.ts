import { getActionIcon } from './getActionIcon'

describe('getActionIcon', () => {
  it('should return undefined if the trade is past offer', () => {
    const tradeSummary = { tradeStatus: 'tradeCompleted' } as const
    expect(getActionIcon(tradeSummary, false)).toBe(undefined)
  })
  it('should return sell if the trade is a contract summary and has a dispute winner', () => {
    const tradeSummary = {
      tradeStatus: 'releaseEscrow',
      price: 21,
      currency: 'EUR',
      disputeWinner: 'seller',
    } as const
    expect(getActionIcon(tradeSummary, false)).toBe('sell')
  })
  it('should return the icon from the statusIcons object otherwise', () => {
    const tradeSummary = { tradeStatus: 'releaseEscrow' } as const
    expect(getActionIcon(tradeSummary, false)).toBe('upload')
  })
  it('should return refresh if the trade has unknown trade status', () => {
    const tradeSummary = { tradeStatus: 'newStatusNotYetConsiered' } as const
    // @ts-expect-error explicitely testing unknown status
    expect(getActionIcon(tradeSummary, false)).toBe('refreshCw')
  })
})
