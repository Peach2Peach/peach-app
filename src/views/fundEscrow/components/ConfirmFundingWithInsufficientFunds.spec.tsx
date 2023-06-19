import { createRenderer } from 'react-test-renderer/shallow'
import { ConfirmFundingWithInsufficientFunds } from './ConfirmFundingWithInsufficientFunds'

describe('ConfirmFundingWithInsufficientFunds', () => {
  const shallowRenderer = createRenderer()
  it('should render correctly', () => {
    shallowRenderer.render(
      <ConfirmFundingWithInsufficientFunds address="address" amount={123456} fee={110} feeRate={1} />,
    )
    expect(shallowRenderer.getRenderOutput()).toMatchSnapshot()
  })
})
