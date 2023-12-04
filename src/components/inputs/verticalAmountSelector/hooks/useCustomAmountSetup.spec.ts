import { act, renderHook } from 'test-utils'
import { useCustomAmountSetup } from './useCustomAmountSetup'

const displayCurrency = 'EUR'
const bitcoinPrice = 26600
const useBitcoinPricesMock = jest.fn().mockReturnValue({
  displayCurrency,
  bitcoinPrice,
})
jest.mock('../../../../hooks', () => ({
  useBitcoinPrices: () => useBitcoinPricesMock(),
}))

describe('useCustomAmountSetup', () => {
  const setAmount = jest.fn()
  const initialProps = {
    amount: 50000,
    onChange: setAmount,
  }

  it('should return default values', () => {
    const { result } = renderHook(useCustomAmountSetup, { initialProps })
    expect(result.current).toEqual({
      updateCustomAmount: expect.any(Function),
      clearCustomAmount: expect.any(Function),
      customFiatPrice: 13.3,
      updateCustomFiatAmount: expect.any(Function),
      displayCurrency,
    })
  })
  it('should clear custom amount', () => {
    const { result } = renderHook(useCustomAmountSetup, { initialProps })
    result.current.clearCustomAmount()
    expect(setAmount).toHaveBeenCalledWith(0)
  })
  it('should update custom amount', () => {
    const { result } = renderHook(useCustomAmountSetup, { initialProps })
    act(() => result.current.updateCustomAmount('60000'))
    expect(setAmount).toHaveBeenCalledWith(60000)
    expect(result.current.customFiatPrice).toBe(15.96)
  })
  it('should clear custom amount if inavild input', () => {
    const { result } = renderHook(useCustomAmountSetup, { initialProps })
    act(() => result.current.updateCustomAmount('B'))
    expect(setAmount).toHaveBeenCalledWith(0)
  })
  it('should update custom fiat amount', () => {
    const { result } = renderHook(useCustomAmountSetup, { initialProps })
    act(() => result.current.updateCustomFiatAmount('20'))
    expect(setAmount).toHaveBeenCalledWith(75188)
    expect(result.current.customFiatPrice).toBe(20)
  })
  it('should clear custom amount if inavild fiat input', () => {
    const { result } = renderHook(useCustomAmountSetup, { initialProps })
    act(() => result.current.updateCustomFiatAmount('B'))
    expect(setAmount).toHaveBeenCalledWith(0)
  })
})
