import { render, responseUtils, waitFor } from 'test-utils'
import { queryClient } from '../../../tests/unit/helpers/QueryClientWrapper'
import { peachAPI } from '../../utils/peachAPI'
import { EditPremium } from './EditPremium'

jest.useFakeTimers()

jest.mock('../../hooks/useRoute', () => ({
  useRoute: () => ({
    params: {
      offerId: '123',
    },
  }),
}))
jest.spyOn(peachAPI.public.market, 'marketPrices').mockResolvedValue({
  result: {
    EUR: 100000,
  },
  ...responseUtils,
})

describe('EditPremium', () => {
  it('should render correctly', async () => {
    const { toJSON } = render(<EditPremium />)
    await waitFor(() => {
      expect(queryClient.getQueryState(['offer', '123'])?.status).toBe('success')
      expect(queryClient.getQueryState(['marketPrices'])?.status).toBe('success')
    })
    expect(toJSON()).toMatchSnapshot()
  })
})
