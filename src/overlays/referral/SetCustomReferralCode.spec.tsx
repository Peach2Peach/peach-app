import { createRenderer } from 'react-test-renderer/shallow'
import { SetCustomReferralCode } from './SetCustomReferralCode'

describe('SetCustomReferralCode', () => {
  const shallowRenderer = createRenderer()
  const referralCode = 'SATOSHI'
  const setReferralCode = jest.fn()
  const referralCodeErrors: string[] = []

  it('should render correctly', () => {
    shallowRenderer.render(<SetCustomReferralCode {...{ referralCode, setReferralCode, referralCodeErrors }} />)
    expect(shallowRenderer.getRenderOutput()).toMatchSnapshot()
  })
})
