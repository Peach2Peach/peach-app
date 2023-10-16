import { render } from 'test-utils'
import { Referrals } from './Referrals'

const useReferralsSetupMock = jest.fn().mockReturnValue({
  user: {
    referredTradingAmount: 0,
    referralCode: 'referralCode',
  },
  pointsBalance: 0,
  availableRewards: false,
  selectedReward: undefined,
  setSelectedReward: jest.fn(),
  redeem: jest.fn(),
})

jest.mock('./hooks/useReferralsSetup', () => ({
  useReferralsSetup: () => useReferralsSetupMock(),
}))

describe('Referrals', () => {
  it('renders correctly', () => {
    const { toJSON } = render(<Referrals />)

    expect(toJSON()).toMatchSnapshot()
  })
  it('renders correctly when user is undefined', () => {
    useReferralsSetupMock.mockReturnValueOnce({
      user: undefined,
      pointsBalance: 0,
      availableRewards: false,
      selectedReward: undefined,
      setSelectedReward: jest.fn(),
      redeem: jest.fn(),
    })

    const { toJSON } = render(<Referrals />)
    expect(toJSON()).toMatchSnapshot()
  })
})
