import { createRenderer } from 'react-test-renderer/shallow'
import { SetCustomReferralCodeSuccess } from './SetCustomReferralCodeSuccess'

describe('SetCustomReferralCodeSuccess', () => {
  const shallowRenderer = createRenderer()
  const referralCode = 'SATOSHI'

  it('should render correctly', () => {
    shallowRenderer.render(<SetCustomReferralCodeSuccess {...{ referralCode }} />)
    expect(shallowRenderer.getRenderOutput()).toMatchSnapshot()
  })
})
