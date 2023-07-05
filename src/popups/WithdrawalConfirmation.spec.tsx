import { createRenderer } from 'react-test-renderer/shallow'
import { WithdrawalConfirmation } from './WithdrawalConfirmation'

describe('WithdrawalConfirmation', () => {
  const shallowRenderer = createRenderer()
  it('should render correctly', () => {
    shallowRenderer.render(<WithdrawalConfirmation address="address" amount={123456} fee={110} feeRate={1} />)
    expect(shallowRenderer.getRenderOutput()).toMatchSnapshot()
  })
})
