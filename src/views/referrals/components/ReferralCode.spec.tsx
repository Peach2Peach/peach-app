import { createRenderer } from 'react-test-renderer/shallow'
import { ReferralCode } from './ReferralCode'

describe('ReferralCode', () => {
  const shallowRenderer = createRenderer()
  it('should render component correctly', () => {
    shallowRenderer.render(<ReferralCode referralCode="HALFIN" />)
    expect(shallowRenderer.getRenderOutput()).toMatchSnapshot()
  })
})
