import { getCategories } from './getCategories'

// eslint-disable-next-line max-lines-per-function
describe('getCategories', () => {
  it('returns the correct categories with non-empty data', () => {
    const trades: Pick<TradeSummary, 'tradeStatus' | 'type' | 'unreadMessages'>[] = [
      { type: 'bid', tradeStatus: 'rateUser', unreadMessages: 1 },
      { type: 'ask', tradeStatus: 'dispute', unreadMessages: 0 },
      { type: 'bid', tradeStatus: 'searchingForPeer', unreadMessages: 2 },
      { type: 'ask', tradeStatus: 'tradeCanceled', unreadMessages: 3 },
      { type: 'bid', tradeStatus: 'tradeCompleted', unreadMessages: 0 },
    ]

    const result = getCategories(trades)

    expect(result).toEqual([
      {
        title: 'priority',
        data: [{ type: 'ask', tradeStatus: 'dispute', unreadMessages: 0 }],
      },
      {
        title: 'openActions',
        data: [{ type: 'bid', tradeStatus: 'rateUser', unreadMessages: 1 }],
      },
      {
        title: 'waiting',
        data: [{ type: 'bid', tradeStatus: 'searchingForPeer', unreadMessages: 2 }],
      },
      {
        title: 'newMessages',
        data: [{ type: 'ask', tradeStatus: 'tradeCanceled', unreadMessages: 3 }],
      },
      {
        title: 'history',
        data: [{ type: 'bid', tradeStatus: 'tradeCompleted', unreadMessages: 0 }],
      },
    ])
  })

  it('returns category only if data is not empty', () => {
    const trades: Pick<TradeSummary, 'tradeStatus' | 'type' | 'unreadMessages'>[] = [
      { type: 'bid', tradeStatus: 'rateUser', unreadMessages: 1 },
      { type: 'ask', tradeStatus: 'dispute', unreadMessages: 0 },
      { type: 'bid', tradeStatus: 'searchingForPeer', unreadMessages: 2 },
    ]

    const result = getCategories(trades)

    expect(result).toEqual([
      {
        title: 'priority',
        data: [{ type: 'ask', tradeStatus: 'dispute', unreadMessages: 0 }],
      },
      {
        title: 'openActions',
        data: [{ type: 'bid', tradeStatus: 'rateUser', unreadMessages: 1 }],
      },
      {
        title: 'waiting',
        data: [{ type: 'bid', tradeStatus: 'searchingForPeer', unreadMessages: 2 }],
      },
    ])
  })

  it('should return data for trades that have an error status', () => {
    const trades: Pick<TradeSummary, 'tradeStatus' | 'type' | 'unreadMessages'>[] = [
      {
        type: 'ask',
        tradeStatus: 'dispute',
        unreadMessages: 0,
      },
    ]

    const result = getCategories(trades)
    expect(result).toEqual([
      {
        title: 'priority',
        data: [{ type: 'ask', tradeStatus: 'dispute', unreadMessages: 0 }],
      },
    ])
  })
})
