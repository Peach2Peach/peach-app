import { render } from '@testing-library/react-native'
import { contract } from '../../../../tests/unit/data/contractData'
import { NavigationWrapper } from '../../../../tests/unit/helpers/NavigationWrapper'
import { PendingPayoutInfo } from './PendingPayoutInfo'

const useContractContextMock = jest.fn().mockReturnValue({
  contract: {
    ...contract,
    batchInfo: {
      completed: false,
      maxParticipants: 100,
      participants: 20,
      timeRemaining: 4320,
    },
  },
})
jest.mock('../context', () => ({
  useContractContext: () => useContractContextMock(),
}))
jest.useFakeTimers()

const wrapper = NavigationWrapper
describe('PendingPayoutInfo', () => {
  it('should render correctly', () => {
    const { toJSON } = render(<PendingPayoutInfo />, { wrapper })

    expect(toJSON()).toMatchSnapshot()
  })
  it('should render correctly when eta is not known yet', () => {
    useContractContextMock.mockReturnValue({
      contract: {
        ...contract,
        batchInfo: {
          completed: false,
          maxParticipants: 100,
          participants: 20,
          timeRemaining: -2,
        },
      },
    })
    const { toJSON } = render(<PendingPayoutInfo />, { wrapper })
    expect(toJSON()).toMatchSnapshot()
  })
})
