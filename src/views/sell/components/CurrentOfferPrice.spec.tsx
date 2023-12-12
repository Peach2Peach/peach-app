import { render, waitFor } from 'test-utils'
import { queryClient } from '../../../../tests/unit/helpers/QueryClientWrapper'
import { useOfferPreferences } from '../../../store/offerPreferenes'
import { useSettingsStore } from '../../../store/settingsStore'
import { CurrentOfferPrice } from './CurrentOfferPrice'

describe('CurrentOfferPrice', () => {
  afterEach(() => {
    queryClient.clear()
  })
  it('should not render if currentPrice is 0', async () => {
    const { toJSON } = render(<CurrentOfferPrice />)
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
    useSettingsStore.setState({
      displayCurrency: 'EUR',
    })
    const { toJSON } = render(<CurrentOfferPrice />)
    await waitFor(() => {
      expect(queryClient.isFetching()).toBe(0)
    })
    expect(toJSON()).toMatchSnapshot()
  })
})
