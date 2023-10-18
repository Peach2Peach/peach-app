import { renderHook } from 'test-utils'
import { buyOffer, matchOffer } from '../../../../tests/unit/data/offerData'
import { useMatchPriceData } from './useMatchPriceData'

const useMarketPricesMock = jest.fn().mockReturnValue({
  data: {
    EUR: 400,
  },
  isSuccess: true,
})
jest.mock('../../../hooks', () => ({
  useMarketPrices: () => useMarketPricesMock(),
}))

describe('useMatchPriceData', () => {
  it('should return the correct values', () => {
    const { result } = renderHook(() => useMatchPriceData(matchOffer, buyOffer))
    expect(result.current.displayPrice).toBe(1)
    expect(result.current.premium).toBe(0)
    expect(result.current.selectedCurrency).toBe('EUR')
  })
  it('should fall back to a premium of 0 if the priceBook is not available and the match is matched', () => {
    useMarketPricesMock.mockReturnValueOnce({
      data: undefined,
      isSuccess: false,
    })
    const { result } = renderHook(() => useMatchPriceData({ ...matchOffer, matched: true, premium: 21 }, buyOffer))
    expect(result.current.displayPrice).toBe(1)
    expect(result.current.premium).toBe(0)
    expect(result.current.selectedCurrency).toBe('EUR')
  })
  it('should return the premium from the match if the match is not matched yet', () => {
    const { result } = renderHook(() => useMatchPriceData({ ...matchOffer, premium: 0.25, matched: false }, buyOffer))
    expect(result.current.displayPrice).toBe(1)
    expect(result.current.premium).toBe(0.25)
    expect(result.current.selectedCurrency).toBe('EUR')
  })
  it('should fallback to match.meansOfPayment if there are no mopsInCommon', () => {
    const { result } = renderHook(() =>
      useMatchPriceData(
        { ...matchOffer, meansOfPayment: { EUR: ['sepa'] } },
        { ...buyOffer, meansOfPayment: { CHF: ['twint'] } },
      ),
    )
    expect(result.current.displayPrice).toBe(1)
    expect(result.current.premium).toBe(0)
    expect(result.current.selectedCurrency).toBe('EUR')
  })
})
