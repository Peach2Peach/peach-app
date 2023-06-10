import { renderHook } from '@testing-library/react-native'
import { settings1 } from '../../../../tests/unit/data/settingsData'
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
jest.mock('../../../hooks/useNavigation', () => ({
  useNavigation: jest.fn().mockReturnValue({
    navigate: jest.fn(),
  }),
}))
jest.mock('@react-navigation/native', () => ({
  useFocusEffect: jest.fn(),
}))

const useSellSetupMock = jest.fn()
jest.mock('./useSellSetup', () => ({
  useSellSetup: (...args: any) => useSellSetupMock(...args),
}))

// eslint-disable-next-line max-lines-per-function
describe('usePremiumSetup', () => {
  const sellAmount = 100000
  beforeEach(() => {
    jest.clearAllMocks()
  })

  beforeEach(() => {
    settingsStore.setState({ displayCurrency: 'EUR' })
    useOfferPreferences.getState().setSellAmount(sellAmount, { min: 1000, max: 1000000 })
  })

  it('returns default values correctly', () => {
    const { result } = renderHook(usePremiumSetup)

    expect(result.current.currentPrice).toBe(20.3)
    expect(result.current.displayCurrency).toBe(settings1.displayCurrency)
    expect(result.current.isStepValid).toBeTruthy()
  })
  it('calls useSellSetup with correct params', () => {
    renderHook(usePremiumSetup)

    expect(useSellSetupMock).toHaveBeenCalledWith({ help: 'premium' })
  })
  it('defaults to a price of 0 if the market price is not available', () => {
    useMarketPricesMock.mockReturnValue({ data: null })
    const { result } = renderHook(usePremiumSetup)

    expect(result.current.currentPrice).toBe(0)
  })
})
