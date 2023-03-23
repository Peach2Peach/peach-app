import { act, renderHook } from '@testing-library/react-hooks'
import { usePremiumSetup } from './usePremiumSetup'
import { getSellOfferDraft } from '../helpers/getSellOfferDraft'
import { setAccount } from '../../../utils/account'
import { account1 } from '../../../../tests/unit/data/accountData'
import { defaultLimits } from '../../../utils/account/account'

const useSettingsStoreMock = jest.fn()
jest.mock('../../../store/settingsStore', () => ({
  ...jest.requireActual('../../../store/settingsStore'),
  useSettingsStore: () => useSettingsStoreMock(),
}))
const useMarketPricesMock = jest.fn()
jest.mock('../../../hooks/query/useMarketPrices', () => ({
  useMarketPrices: () => useMarketPricesMock(),
}))
const useTradingLimitsMock = jest.fn()
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

describe('usePremiumSetup', () => {
  const setOfferDraftMock = jest.fn()
  const setPremiumMock = jest.fn()
  const premium = 1.5
  const sellAmount = 100000
  beforeEach(async () => {
    useSettingsStoreMock.mockReturnValue([premium, setPremiumMock])
    useMarketPricesMock.mockReturnValue({
      data: {
        EUR: 20000,
        CHF: 20000,
      },
    })
    useTradingLimitsMock.mockReturnValue({ limits: defaultLimits })
    setAccount(account1)
  })
  afterEach(() => {
    jest.resetAllMocks()
  })
  it('returns default values ccorrectly', () => {
    const sellOfferDraft = getSellOfferDraft({ sellAmount, premium })
    const { result } = renderHook(() => usePremiumSetup(sellOfferDraft, setOfferDraftMock))

    expect(result.current.premium).toBe(premium.toString())
    expect(result.current.updatePremium).toBeInstanceOf(Function)
    expect(result.current.currentPrice).toBe(20.3)
    expect(result.current.displayCurrency).toBe(account1.settings.displayCurrency)
    expect(result.current.stepValid).toBeTruthy()
  })
  it('updatePremium is updating the premium', () => {
    const sellOfferDraft = getSellOfferDraft({ sellAmount, premium })
    const { result } = renderHook(() => usePremiumSetup(sellOfferDraft, setOfferDraftMock))

    act(() => {
      result.current.updatePremium(10)
    })
    expect(result.current.premium).toBe('10')
    expect(setOfferDraftMock).toHaveBeenCalled()
  })
})
