import { render } from 'test-utils'
import { NavigationAndQueryClientWrapper } from '../../../tests/unit/helpers/CustomWrapper'
import { useBitcoinStore } from '../../store/bitcoinStore'
import { useOfferPreferences } from '../../store/offerPreferenes/useOfferPreferences'
import { Sell } from './Sell'

const useMarketPricesMock = jest.fn().mockReturnValue({
  data: { EUR: 20000, CHF: 21000 },
})
jest.mock('../../hooks/query/useMarketPrices', () => ({
  useMarketPrices: () => useMarketPricesMock(),
}))

const wrapper = NavigationAndQueryClientWrapper

jest.useFakeTimers()

describe('Sell', () => {
  beforeAll(() => {
    useBitcoinStore.setState({
      currency: 'EUR',
      satsPerUnit: 250,
      price: 400000,
    })
  })
  it('should render correctly while loading max trading amount', () => {
    useOfferPreferences.getState().setSellAmount(Infinity, { min: 0, max: 10 })
    const { toJSON } = render(<Sell />, { wrapper })
    expect(toJSON()).toMatchSnapshot()
  })
  it('should render correctly', () => {
    useOfferPreferences.getState().setSellAmount(1000000, { min: 0, max: 10 })

    const { toJSON } = render(<Sell />, { wrapper })
    expect(toJSON()).toMatchSnapshot()
  })
})
