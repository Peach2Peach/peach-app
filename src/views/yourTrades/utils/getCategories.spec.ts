import { contractSummary } from '../../../../tests/unit/data/contractSummaryData'
import { getCategories } from './getCategories'

// eslint-disable-next-line max-lines-per-function
describe('getCategories', () => {
  it('returns the correct categories with non-empty data', () => {
    const trades: TradeSummary[] = [
      { ...contractSummary, type: 'bid', tradeStatus: 'rateUser', unreadMessages: 1 },
      { ...contractSummary, type: 'ask', tradeStatus: 'dispute', unreadMessages: 0 },
      { ...contractSummary, type: 'bid', tradeStatus: 'searchingForPeer', unreadMessages: 2 },
      { ...contractSummary, type: 'ask', tradeStatus: 'tradeCanceled', unreadMessages: 3 },
      { ...contractSummary, type: 'bid', tradeStatus: 'tradeCompleted', unreadMessages: 0 },
    ]

    const result = getCategories(trades)

    expect(result).toEqual([
      {
        title: 'priority',
        data: [{ ...contractSummary, type: 'ask', tradeStatus: 'dispute', unreadMessages: 0 }],
      },
      {
        title: 'openActions',
        data: [{ ...contractSummary, type: 'bid', tradeStatus: 'rateUser', unreadMessages: 1 }],
      },
      {
        title: 'waiting',
        data: [{ ...contractSummary, type: 'bid', tradeStatus: 'searchingForPeer', unreadMessages: 2 }],
      },
      {
        title: 'newMessages',
        data: [{ ...contractSummary, type: 'ask', tradeStatus: 'tradeCanceled', unreadMessages: 3 }],
      },
      {
        title: 'history',
        data: [{ ...contractSummary, type: 'bid', tradeStatus: 'tradeCompleted', unreadMessages: 0 }],
      },
    ])
  })

  it('returns category only if data is not empty', () => {
    const trades: TradeSummary[] = [
      { ...contractSummary, type: 'bid', tradeStatus: 'rateUser', unreadMessages: 1 },
      { ...contractSummary, type: 'ask', tradeStatus: 'dispute', unreadMessages: 0 },
      { ...contractSummary, type: 'bid', tradeStatus: 'searchingForPeer', unreadMessages: 2 },
    ]

    const result = getCategories(trades)

    expect(result).toEqual([
      {
        title: 'priority',
        data: [{ ...contractSummary, type: 'ask', tradeStatus: 'dispute', unreadMessages: 0 }],
      },
      {
        title: 'openActions',
        data: [{ ...contractSummary, type: 'bid', tradeStatus: 'rateUser', unreadMessages: 1 }],
      },
      {
        title: 'waiting',
        data: [{ ...contractSummary, type: 'bid', tradeStatus: 'searchingForPeer', unreadMessages: 2 }],
      },
    ])
  })

  it('should return data for trades that have an error status', () => {
    const trades: TradeSummary[] = [
      {
        ...contractSummary,
        type: 'ask',
        tradeStatus: 'dispute',
        unreadMessages: 0,
      },
    ]

    const result = getCategories(trades)
    expect(result).toEqual([
      {
        title: 'priority',
        data: [{ ...contractSummary, type: 'ask', tradeStatus: 'dispute', unreadMessages: 0 }],
      },
    ])
  })
})
