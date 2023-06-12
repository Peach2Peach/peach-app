import { render } from '@testing-library/react-native'
import { NavigationWrapper } from '../../../tests/unit/helpers/NavigationWrapper'
import { QueryClientWrapper } from '../../../tests/unit/helpers/QueryClientWrapper'
import Buy from './Buy'
import { bitcoinStore } from '../../store/bitcoinStore'
import { useOfferPreferences } from '../../store/offerPreferenes/useOfferPreferences'

const useMarketPricesMock = jest.fn().mockReturnValue({
  data: {
    EUR: 20000,
    CHF: 21000,
  },
})
jest.mock('../../hooks/query/useMarketPrices', () => ({
  useMarketPrices: () => useMarketPricesMock(),
}))

const useBuySetupMock = jest.fn().mockResolvedValue({ freeTrades: 0, maxFreeTrades: 5 })
jest.mock('./hooks/useBuySetup', () => ({
  useBuySetup: () => useBuySetupMock(),
}))

const wrapper = ({ children }: ComponentProps) => (
  <NavigationWrapper>
    <QueryClientWrapper>{children}</QueryClientWrapper>
  </NavigationWrapper>
)

jest.useFakeTimers()

describe('Buy', () => {
  beforeAll(() => {
    bitcoinStore.setState({
      currency: 'EUR',
      satsPerUnit: 250,
      price: 400000,
    })
  })
  it('should render correctly while loading max trading amount', () => {
    useOfferPreferences.getState().setBuyAmountRange([0, Infinity], { min: 0, max: 10 })
    const { toJSON } = render(<Buy />, { wrapper })
    expect(toJSON()).toMatchSnapshot()
  })
  it('should render correctly', () => {
    useOfferPreferences.getState().setBuyAmountRange([0, 1000000], { min: 0, max: 10 })

    const { toJSON } = render(<Buy />, { wrapper })
    expect(toJSON()).toMatchSnapshot()
  })
  it('should render correctly with free trades', () => {
    const freeTrades = 5
    useBuySetupMock.mockReturnValue({ freeTrades, maxFreeTrades: 5 })
    const { toJSON } = render(<Buy />, { wrapper })
    expect(toJSON()).toMatchSnapshot()
  })
})
