import { act, renderHook } from '@testing-library/react-native'
import { headerState, NavigationWrapper } from '../../../../tests/unit/helpers/NavigationWrapper'
import { SATSINBTC } from '../../../constants'
import { useOfferPreferences } from '../../../store/offerPreferenes'
import { settingsStore } from '../../../store/settingsStore'
import { defaultLimits } from '../../../utils/account/account'
import { usePremiumSetup } from './usePremiumSetup'

const useMarketPricesMock = jest.fn().mockReturnValue({
  data: {
    EUR: 20000,
    CHF: 20000,
  },
})
jest.mock('../../../hooks/query/useMarketPrices', () => ({
  useMarketPrices: () => useMarketPricesMock(),
}))
const useTradingLimitsMock = jest.fn().mockReturnValue({ limits: defaultLimits })
jest.mock('../../../hooks/query/useTradingLimits', () => ({
  useTradingLimits: () => useTradingLimitsMock(),
}))

// eslint-disable-next-line max-lines-per-function
describe('usePremiumSetup', () => {
  const sellAmount = 100000
  afterEach(() => {
    jest.clearAllMocks()
    act(() => {
      settingsStore.setState({ displayCurrency: 'EUR' })
      useOfferPreferences.getState().setSellAmount(sellAmount, { min: 1000, max: 1000000 })
    })
  })

  it('sets up the header correctly', () => {
    renderHook(usePremiumSetup, { wrapper: NavigationWrapper })
    expect(headerState.header()).toMatchSnapshot()
  })

  it('should validate the premium step when the premium is set too high', () => {
    const SATSPrice = 20000 / SATSINBTC
    useOfferPreferences.setState({ sellAmount: defaultLimits.daily / SATSPrice, premium: 0 })
    renderHook(usePremiumSetup, { wrapper: NavigationWrapper })
    expect(useOfferPreferences.getState().canContinue.premium).toBe(true)
    act(() => {
      useOfferPreferences.setState({ premium: 0.5 })
    })
    expect(useOfferPreferences.getState().canContinue.premium).toBe(false)
  })
  it('should validate the premium step when the price pumps', () => {
    useOfferPreferences.setState({ sellAmount: 210000, premium: 0 })
    const { rerender } = renderHook(usePremiumSetup, { wrapper: NavigationWrapper })
    expect(useOfferPreferences.getState().canContinue.premium).toBe(true)
    useMarketPricesMock.mockReturnValue({
      data: {
        EUR: Infinity,
        CHF: Infinity,
      },
    })
    act(() => {
      rerender(undefined)
    })
    expect(useOfferPreferences.getState().canContinue.premium).toBe(false)
  })
  it('should validate the premium step when the trading limits change', () => {
    useMarketPricesMock.mockReturnValue({
      data: {
        EUR: 20000,
        CHF: 20000,
      },
    })
    const SATSPrice = 20000 / SATSINBTC
    useOfferPreferences.setState({ sellAmount: defaultLimits.daily / SATSPrice, premium: 0 })
    const { rerender } = renderHook(usePremiumSetup, { wrapper: NavigationWrapper })
    expect(useOfferPreferences.getState().canContinue.premium).toBe(true)
    useTradingLimitsMock.mockReturnValue({ limits: { daily: 100 } })
    act(() => {
      rerender(undefined)
    })
    expect(useOfferPreferences.getState().canContinue.premium).toBe(false)
  })
  it('should validate the premium step when the amount changes', () => {
    useTradingLimitsMock.mockReturnValue({ limits: defaultLimits })
    const SATSPrice = 20000 / SATSINBTC
    useOfferPreferences.setState({ sellAmount: defaultLimits.daily / SATSPrice, premium: 0 })
    renderHook(usePremiumSetup, { wrapper: NavigationWrapper })
    expect(useOfferPreferences.getState().canContinue.premium).toBe(true)
    act(() => {
      useOfferPreferences.setState({ sellAmount: defaultLimits.daily / SATSPrice + 1000 })
    })
    expect(useOfferPreferences.getState().canContinue.premium).toBe(false)
  })
  it('should not update the state, if the validation result is the same', () => {
    const setPremiumSpy = jest.spyOn(useOfferPreferences.getState(), 'setPremium')
    useOfferPreferences.setState({ sellAmount: 210000, premium: 0 })
    const { rerender } = renderHook(usePremiumSetup, { wrapper: NavigationWrapper })
    expect(setPremiumSpy).toHaveBeenCalledTimes(0)
    useMarketPricesMock.mockReturnValue({
      data: {
        EUR: Infinity,
        CHF: Infinity,
      },
    })
    act(() => {
      rerender(undefined)
    })
    expect(setPremiumSpy).toHaveBeenCalledTimes(1)

    act(() => {
      rerender(undefined)
    })
    expect(setPremiumSpy).toHaveBeenCalledTimes(1)
  })
})
