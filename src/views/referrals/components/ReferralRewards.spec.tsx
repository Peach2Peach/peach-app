import { createRenderer } from 'react-test-renderer/shallow'
import { fireEvent, render } from 'test-utils'
import { ReferralRewards } from './ReferralRewards'

describe('ReferralRewards', () => {
  const shallowRenderer = createRenderer()
  const setSelectedReward = jest.fn()
  const redeem = jest.fn()
  it('should render component correctly', () => {
    shallowRenderer.render(
      <ReferralRewards
        balance={20}
        referredTradingAmount={200000}
        availableRewards={1}
        setSelectedReward={setSelectedReward}
        redeem={redeem}
      />,
    )
    expect(shallowRenderer.getRenderOutput()).toMatchSnapshot()
  })
  it('should render component correctly with selected reward', () => {
    shallowRenderer.render(
      <ReferralRewards
        balance={20}
        referredTradingAmount={200000}
        availableRewards={1}
        selectedReward="customReferralCode"
        setSelectedReward={setSelectedReward}
        redeem={redeem}
      />,
    )
    expect(shallowRenderer.getRenderOutput()).toMatchSnapshot()
  })
  it('should not a reward if balance is not sufficient', () => {
    const { getByText } = render(
      <ReferralRewards
        balance={20}
        referredTradingAmount={200000}
        availableRewards={1}
        setSelectedReward={setSelectedReward}
        redeem={redeem}
      />,
    )
    fireEvent.press(getByText('custom referral code'))
    expect(setSelectedReward).not.toHaveBeenCalled()
  })
  it('should select a reward', () => {
    const { getByText } = render(
      <ReferralRewards
        balance={100}
        referredTradingAmount={200000}
        availableRewards={1}
        setSelectedReward={setSelectedReward}
        redeem={redeem}
      />,
    )
    fireEvent.press(getByText('custom referral code'))
    expect(setSelectedReward).toHaveBeenCalledWith('customReferralCode')
  })
  it('should not redeem a reward if none is selected', () => {
    const { getByText } = render(
      <ReferralRewards
        balance={100}
        referredTradingAmount={200000}
        availableRewards={1}
        setSelectedReward={setSelectedReward}
        redeem={redeem}
      />,
    )
    fireEvent.press(getByText('select reward'))
    expect(redeem).not.toHaveBeenCalled()
  })
  it('should redeem a reward', () => {
    const { getByText } = render(
      <ReferralRewards
        balance={100}
        referredTradingAmount={200000}
        availableRewards={1}
        selectedReward="customReferralCode"
        setSelectedReward={setSelectedReward}
        redeem={redeem}
      />,
    )
    fireEvent.press(getByText('select reward'))
    expect(redeem).toHaveBeenCalled()
  })
})
