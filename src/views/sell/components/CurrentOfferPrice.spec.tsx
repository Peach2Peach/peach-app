import { render, waitFor } from '@testing-library/react-native'
import { queryClient, QueryClientWrapper } from '../../../../tests/unit/helpers/QueryClientWrapper'
import { useOfferPreferences } from '../../../store/offerPreferenes'
import { settingsStore } from '../../../store/settingsStore'
import { CurrentOfferPrice } from './CurrentOfferPrice'

const marketPricesMock = jest.fn().mockResolvedValue([
  {
    EUR: 21000,
  },
  null,
])
jest.mock('../../../utils/peachAPI/public/market', () => ({
  marketPrices: () => marketPricesMock(),
}))

describe('CurrentOfferPrice', () => {
  afterEach(() => {
    queryClient.clear()
  })
  it('should not render if currentPrice is 0', async () => {
    const { toJSON } = render(<CurrentOfferPrice />, { wrapper: QueryClientWrapper })
    expect(toJSON()).toBeNull()
    await waitFor(() => {
      expect(queryClient.isFetching()).toBe(0)
    })
  })

  it('should render correctly', async () => {
    useOfferPreferences.setState({
      sellAmount: 210000,
      premium: 21,
    })
    settingsStore.setState({
      displayCurrency: 'EUR',
    })
    const { toJSON } = render(<CurrentOfferPrice />, { wrapper: QueryClientWrapper })
    await waitFor(() => {
      expect(queryClient.isFetching()).toBe(0)
    })
    expect(toJSON()).toMatchSnapshot()
  })
})
