import { render, waitFor } from 'test-utils'
import { sellOffer } from '../../../tests/unit/data/offerData'
import { queryClient } from '../../../tests/unit/helpers/QueryClientWrapper'
import { WrongFundingAmount } from './WrongFundingAmount'

jest.mock('../../utils/peachAPI', () => ({
  getOfferDetails: jest.fn().mockResolvedValue([sellOffer, null]),
}))

jest.mock('../../hooks/useRoute', () => ({
  useRoute: jest.fn().mockReturnValue({ params: { offerId: '0x123' } }),
}))

describe('WrongFundingAmount', () => {
  it('should render correctly', async () => {
    const { toJSON } = render(<WrongFundingAmount />)
    await waitFor(() => {
      expect(queryClient.isFetching()).toBe(0)
    })
    expect(toJSON()).toMatchSnapshot()
  })
})
