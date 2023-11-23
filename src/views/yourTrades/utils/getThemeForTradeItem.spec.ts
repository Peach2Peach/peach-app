import { getThemeForTradeItem } from './getThemeForTradeItem'

const completedTradeSeller: Partial<ContractSummary> = {
  id: '1',
  type: 'ask',
  tradeStatus: 'tradeCompleted',
  price: 1,
  currency: 'EUR',
}
const completedTradeBuyer: Partial<ContractSummary> = {
  id: '1',
  type: 'bid',
  tradeStatus: 'tradeCompleted',
  price: 1,
  currency: 'EUR',
}
const canceledTrade: Partial<ContractSummary> = {
  id: '2',
  tradeStatus: 'tradeCanceled',
  price: 1,
  currency: 'EUR',
}

describe('getThemeForTradeItem', () => {
  it('returns the correct theme for a canceled contract', () => {
    const theme = getThemeForTradeItem(canceledTrade as ContractSummary)
    expect(theme).toEqual({
      iconId: 'xCircle',
      color: 'black',
    })
  })

  it('returns the correct theme for a completed trade as buyer', () => {
    const theme = getThemeForTradeItem(completedTradeBuyer as ContractSummary)
    expect(theme).toEqual({ iconId: 'buy', color: 'success' })
  })

  it('returns the correct theme for a completed trade as seller', () => {
    const theme = getThemeForTradeItem(completedTradeSeller as ContractSummary)
    expect(theme).toEqual({ iconId: 'sell', color: 'primary' })
  })
  it('returns the correct theme for a lost dispute as buyer', () => {
    const theme = getThemeForTradeItem({
      ...completedTradeBuyer,
      disputeWinner: 'seller',
    } as ContractSummary)
    expect(theme).toEqual({ iconId: 'alertOctagon', color: 'error' })
  })
  it('returns the correct theme for a won dispute as seller', () => {
    const theme = getThemeForTradeItem({
      ...completedTradeSeller,
      disputeWinner: 'seller',
    } as ContractSummary)
    expect(theme).toEqual({ iconId: 'alertOctagon', color: 'success' })
  })
})
