import { createRenderer } from 'react-test-renderer/shallow'
import { ConfirmFundingFromPeachWallet } from './ConfirmFundingFromPeachWallet'

describe('ConfirmFundingFromPeachWallet', () => {
  const shallowRenderer = createRenderer()
  it('should render correctly', () => {
    shallowRenderer.render(<ConfirmFundingFromPeachWallet address="address" amount={123456} fee={110} feeRate={1} />)
    expect(shallowRenderer.getRenderOutput()).toMatchSnapshot()
  })
})
