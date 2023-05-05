import { render } from '@testing-library/react-native'
import { NavigationWrapper } from '../../../tests/unit/helpers/NavigationWrapper'
import { QueryClientWrapper } from '../../../tests/unit/helpers/QueryClientWrapper'
import { settingsStore } from '../../store/settingsStore'
import Buy from './Buy'

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
  beforeEach(() => {
    settingsStore.getState().setMaxBuyAmount(1000000)
  })
  afterEach(() => {
    settingsStore.getState().reset()
    jest.clearAllMocks()
  })
  it('should render correctly while loading max trading amount', () => {
    settingsStore.getState().setMaxBuyAmount(Infinity)
    const { toJSON } = render(<Buy />, { wrapper })
    expect(toJSON()).toMatchSnapshot()
  })
  it('should render correctly', () => {
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
