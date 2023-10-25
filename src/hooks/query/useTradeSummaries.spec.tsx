import { renderHook, waitFor } from 'test-utils'
import { contractSummary } from '../../../tests/unit/data/contractSummaryData'
import { offerSummary } from '../../../tests/unit/data/offerSummaryData'
import { useTradeSummaries } from './useTradeSummaries'

jest.useFakeTimers()

jest.mock('../../utils/peachAPI', () => ({
  getOfferSummaries: jest.fn(() => Promise.resolve([[offerSummary], null])),
  getContractSummaries: jest.fn(() => Promise.resolve([[contractSummary], null])),
}))

describe('useTradeSummaries', () => {
  it('should return a list of trade summaries', async () => {
    const { result } = renderHook(useTradeSummaries)

    await waitFor(() => {
      expect(result.current.tradeSummaries).toEqual([contractSummary, offerSummary])
    })
  })
})
