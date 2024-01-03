import { render, waitFor } from 'test-utils'
import { setRouteMock } from '../../../tests/unit/helpers/NavigationWrapper'
import { queryClient } from '../../../tests/unit/helpers/QueryClientWrapper'
import { WrongFundingAmount } from './WrongFundingAmount'

describe('WrongFundingAmount', () => {
  beforeAll(() => {
    setRouteMock({ name: 'wrongFundingAmount', key: 'wrongFundingAmount', params: { offerId: '0x123' } })
  })
  it('should render correctly', async () => {
    const { toJSON } = render(<WrongFundingAmount />)
    await waitFor(() => {
      expect(queryClient.isFetching()).toBe(0)
    })
    expect(toJSON()).toMatchSnapshot()
  })
})
