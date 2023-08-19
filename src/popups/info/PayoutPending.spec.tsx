import ShallowRenderer from 'react-test-renderer/shallow'
import { PayoutPending } from './PayoutPending'

describe('PayoutPending', () => {
  const renderer = ShallowRenderer.createRenderer()
  it('renders correctly', () => {
    renderer.render(<PayoutPending />)
    expect(renderer.getRenderOutput()).toMatchSnapshot()
  })
})
