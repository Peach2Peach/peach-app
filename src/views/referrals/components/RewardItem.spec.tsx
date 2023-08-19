import { createRenderer } from 'react-test-renderer/shallow'
import { RewardItem } from './RewardItem'

describe('RewardItem', () => {
  const shallowRenderer = createRenderer()
  const customReferralCode: Reward = { id: 'customReferralCode', requiredPoints: 100 }
  const noPeachFees: Reward = { id: 'noPeachFees', requiredPoints: 200 }
  const sats: Reward = { id: 'sats', requiredPoints: 300 }
  it('should render component correctly', () => {
    shallowRenderer.render(<RewardItem reward={customReferralCode} />)
    expect(shallowRenderer.getRenderOutput()).toMatchSnapshot()
    shallowRenderer.render(<RewardItem reward={noPeachFees} />)
    expect(shallowRenderer.getRenderOutput()).toMatchSnapshot()
    shallowRenderer.render(<RewardItem reward={sats} />)
    expect(shallowRenderer.getRenderOutput()).toMatchSnapshot()
  })
})
