import { EditPremium } from './EditPremium'
import { render, waitFor } from '@testing-library/react-native'
import { NavigationAndQueryClientWrapper } from '../../../tests/unit/helpers/NavigationAndQueryClientWrapper'
import { headerState } from '../../../tests/unit/helpers/NavigationWrapper'
import { queryClient } from '../../../tests/unit/helpers/QueryClientWrapper'

jest.useFakeTimers()

jest.mock('../../hooks/useRoute', () => ({
  useRoute: () => ({
    params: {
      offerId: '123',
    },
  }),
}))

jest.mock('../../utils/peachAPI', () => ({
  getOfferDetails: jest.fn(() =>
    Promise.resolve([
      {
        type: 'ask',
        amount: 21000000,
        premium: 1.5,
        meansOfPayment: {
          EUR: {
            name: 'SEPA',
            id: '123',
          },
        },
      },
    ]),
  ),
}))

jest.mock('../../utils/peachAPI/public/market', () => ({
  marketPrices: jest.fn(() =>
    Promise.resolve([
      {
        EUR: 100000,
      },
    ]),
  ),
}))

describe('EditPremium', () => {
  it('should render correctly', async () => {
    const { toJSON } = render(<EditPremium />, { wrapper: NavigationAndQueryClientWrapper })
    await waitFor(() => {
      expect(queryClient.getQueryState(['offer', '123'])?.status).toBe('success')
      expect(queryClient.getQueryState(['marketPrices'])?.status).toBe('success')
    })
    expect(toJSON()).toMatchSnapshot()
  })
  it('should set up the header correctly', () => {
    render(<EditPremium />, { wrapper: NavigationAndQueryClientWrapper })
    expect(headerState.header()).toMatchSnapshot()
  })
})
