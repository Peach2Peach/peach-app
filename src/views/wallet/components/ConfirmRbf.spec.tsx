import ShallowRenderer from 'react-test-renderer/shallow'
import { ConfirmRbf } from './ConfirmRbf'

describe('ConfirmRbf', () => {
  const renderer = ShallowRenderer.createRenderer()
  it('renders correctly', () => {
    renderer.render(<ConfirmRbf oldFeeRate={1} newFeeRate={3} bytes={110} sendingAmount={4000} />)
    expect(renderer.getRenderOutput()).toMatchSnapshot()
  })
})
