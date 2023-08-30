import { renderHook, waitFor } from '@testing-library/react-native'
import { contractSummary } from '../../../tests/unit/data/contractSummaryData'
import { offerSummary } from '../../../tests/unit/data/offerSummaryData'
import { QueryClientWrapper } from '../../../tests/unit/helpers/QueryClientWrapper'
import { useTradeSummaries } from './useTradeSummaries'

jest.useFakeTimers()

jest.mock('../../utils/peachAPI', () => ({
  getOfferSummaries: jest.fn(() => Promise.resolve([[offerSummary], null])),
  getContractSummaries: jest.fn(() => Promise.resolve([[contractSummary], null])),
}))

describe('useTradeSummaries', () => {
  it('should return a list of trade summaries', async () => {
    const { result } = renderHook(useTradeSummaries, { wrapper: QueryClientWrapper })

    await waitFor(() => {
      expect(result.current.tradeSummaries).toEqual([contractSummary, offerSummary])
    })
  })
})
