import { getCompletedTrades } from '../../../../src/utils/tradeSummary'

describe('getCompletedTrades', () => {
  const contracts: Partial<ContractSummary>[] = [
    {
      tradeStatus: 'tradeCompleted',
    },
    {
      tradeStatus: 'tradeCanceled',
    },
    {
      tradeStatus: 'tradeCompleted',
    },
  ]

  it('should return only completed trades', () => {
    const completedTrades = getCompletedTrades(contracts as ContractSummary[])

    expect(completedTrades).toHaveLength(2)
    expect(completedTrades.every(({ tradeStatus }) => tradeStatus === 'tradeCompleted')).toBe(true)
  })
})
