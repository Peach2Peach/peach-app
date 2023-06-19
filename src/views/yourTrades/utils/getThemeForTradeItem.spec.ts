import tw from '../../../styles/tailwind'
import { getThemeForTradeItem } from '.'

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
      icon: 'xCircle',
      level: 'gray',
      color: tw`text-black-5`.color,
    })
  })

  it('returns the correct theme for a completed trade as buyer', () => {
    const theme = getThemeForTradeItem(completedTradeBuyer as ContractSummary)
    expect(theme).toEqual({ icon: 'buy', level: 'green', color: tw`text-success-mild`.color })
  })

  it('returns the correct theme for a completed trade as seller', () => {
    const theme = getThemeForTradeItem(completedTradeSeller as ContractSummary)
    expect(theme).toEqual({ icon: 'sell', level: 'orange', color: tw`text-primary-mild-2`.color })
  })
  it('returns the correct theme for a lost dispute as buyer', () => {
    const theme = getThemeForTradeItem({
      ...completedTradeBuyer,
      disputeWinner: 'seller',
    } as ContractSummary)
    expect(theme).toEqual({ icon: 'alertOctagon', level: 'red', color: '#DF321F' })
  })
  it('returns the correct theme for a won dispute as seller', () => {
    const theme = getThemeForTradeItem({
      ...completedTradeSeller,
      disputeWinner: 'seller',
    } as ContractSummary)
    expect(theme).toEqual({ icon: 'alertOctagon', level: 'green', color: '#05A85A' })
  })
})
