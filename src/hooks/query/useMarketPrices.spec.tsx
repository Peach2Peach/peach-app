import { renderHook, waitFor } from 'test-utils'
import { useMarketPrices } from './useMarketPrices'

const marketPricesMock = jest.fn().mockResolvedValue([
  {
    EUR: 21000,
    CHF: 21000,
  },
  null,
])
jest.mock('../../utils/peachAPI/public/market', () => ({
  marketPrices: () => marketPricesMock(),
}))
jest.useFakeTimers()
describe('useMarketPrices', () => {
  it('should return marketPrices', async () => {
    const { result } = renderHook(useMarketPrices)
    expect(result.current.isLoading).toEqual(true)
    await waitFor(() => expect(result.current.isLoading).toEqual(false))
    expect(result.current.data).toEqual({
      EUR: 21000,
      CHF: 21000,
    })
  })
  it('should handle errors', async () => {
    marketPricesMock.mockResolvedValueOnce([null, null])
    const { result } = renderHook(useMarketPrices)
    await waitFor(() => {
      expect(result.current.error).toEqual(Error('Error fetching market prices'))
    })
  })
  it('should refetch every 15 seconds', async () => {
    marketPricesMock
      .mockResolvedValueOnce([
        {
          EUR: 21000,
          CHF: 21000,
        },
        null,
      ])
      .mockResolvedValueOnce([
        {
          EUR: 100000,
          CHF: 100000,
        },
        null,
      ])

    const { result } = renderHook(useMarketPrices)
    await waitFor(() => {
      expect(result.current.data).toEqual({
        EUR: 21000,
        CHF: 21000,
      })
    })
    jest.advanceTimersByTime(15000)
    await waitFor(() => {
      expect(result.current.data).toEqual({
        EUR: 100000,
        CHF: 100000,
      })
    })
  })
  it('should preserve the existing data on error', async () => {
    marketPricesMock
      .mockResolvedValueOnce([
        {
          EUR: 21000,
          CHF: 21000,
        },
        null,
      ])
      .mockResolvedValueOnce([null, null])

    const { result } = renderHook(useMarketPrices)
    await waitFor(() => {
      expect(result.current.data).toEqual({
        EUR: 21000,
        CHF: 21000,
      })
    })
    jest.advanceTimersByTime(15000)
    await waitFor(() => {
      expect(result.current.isError).toBe(true)
      expect(result.current.data).toEqual({
        EUR: 21000,
        CHF: 21000,
      })
    })
  })
})
