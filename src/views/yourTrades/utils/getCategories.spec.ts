import { getCategories } from './getCategories'

// eslint-disable-next-line max-lines-per-function
describe('getCategories', () => {
  const defaultSummary = {
    id: 'id',
    offerId: 'offerId',
    creationDate: new Date('2020-12-12'),
    lastModified: new Date('2020-12-12'),
    amount: 21000,
    price: 2100,
    currency: 'EUR',
  } as const
  it('returns the correct categories with non-empty data', () => {
    const trades: TradeSummary[] = [
      { type: 'bid', tradeStatus: 'rateUser', unreadMessages: 1, ...defaultSummary },
      { type: 'ask', tradeStatus: 'dispute', unreadMessages: 0, ...defaultSummary },
      { type: 'bid', tradeStatus: 'searchingForPeer', unreadMessages: 2, ...defaultSummary },
      { type: 'ask', tradeStatus: 'tradeCanceled', unreadMessages: 3, ...defaultSummary },
      { type: 'bid', tradeStatus: 'tradeCompleted', unreadMessages: 0, ...defaultSummary },
    ]

    const result = getCategories(trades)

    expect(result).toEqual([
      {
        title: 'priority',
        data: [{ ...defaultSummary, type: 'ask', tradeStatus: 'dispute', unreadMessages: 0 }],
      },
      {
        title: 'openActions',
        data: [{ ...defaultSummary, type: 'bid', tradeStatus: 'rateUser', unreadMessages: 1 }],
      },
      {
        title: 'waiting',
        data: [{ ...defaultSummary, type: 'bid', tradeStatus: 'searchingForPeer', unreadMessages: 2 }],
      },
      {
        title: 'newMessages',
        data: [{ ...defaultSummary, type: 'ask', tradeStatus: 'tradeCanceled', unreadMessages: 3 }],
      },
      {
        title: 'history',
        data: [{ ...defaultSummary, type: 'bid', tradeStatus: 'tradeCompleted', unreadMessages: 0 }],
      },
    ])
  })

  it('returns category only if data is not empty', () => {
    const trades: TradeSummary[] = [
      { ...defaultSummary, type: 'bid', tradeStatus: 'rateUser', unreadMessages: 1 },
      { ...defaultSummary, type: 'ask', tradeStatus: 'dispute', unreadMessages: 0 },
      { ...defaultSummary, type: 'bid', tradeStatus: 'searchingForPeer', unreadMessages: 2 },
    ]

    const result = getCategories(trades)

    expect(result).toEqual([
      {
        title: 'priority',
        data: [{ ...defaultSummary, type: 'ask', tradeStatus: 'dispute', unreadMessages: 0 }],
      },
      {
        title: 'openActions',
        data: [{ ...defaultSummary, type: 'bid', tradeStatus: 'rateUser', unreadMessages: 1 }],
      },
      {
        title: 'waiting',
        data: [{ ...defaultSummary, type: 'bid', tradeStatus: 'searchingForPeer', unreadMessages: 2 }],
      },
    ])
  })

  it('should return data for trades that have an error status', () => {
    const trades: TradeSummary[] = [
      {
        ...defaultSummary,
        type: 'ask',
        tradeStatus: 'dispute',
        unreadMessages: 0,
      },
    ]

    const result = getCategories(trades)
    expect(result).toEqual([
      {
        title: 'priority',
        data: [{ ...defaultSummary, type: 'ask', tradeStatus: 'dispute', unreadMessages: 0 }],
      },
    ])
  })
})
