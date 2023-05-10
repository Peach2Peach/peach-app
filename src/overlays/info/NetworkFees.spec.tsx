import ShallowRenderer from 'react-test-renderer/shallow'
import { NetworkFees } from './NetworkFees'

describe('NetworkFees', () => {
  const renderer = ShallowRenderer.createRenderer()
  it('renders correctly', () => {
    renderer.render(<NetworkFees />)
    expect(renderer.getRenderOutput()).toMatchSnapshot()
  })
})
