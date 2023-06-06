import ShallowRenderer from 'react-test-renderer/shallow'
import { WithdrawingFundsHelp } from './WithdrawingFundsHelp'

describe('WithdrawingFundsHelp', () => {
  const renderer = ShallowRenderer.createRenderer()
  it('renders correctly', () => {
    renderer.render(<WithdrawingFundsHelp />)
    expect(renderer.getRenderOutput()).toMatchSnapshot()
  })
})
