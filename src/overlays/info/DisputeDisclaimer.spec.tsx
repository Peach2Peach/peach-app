import ShallowRenderer from 'react-test-renderer/shallow'
import { DisputeDisclaimer } from './DisputeDisclaimer'

describe('DisputeDisclaimer', () => {
  const renderer = ShallowRenderer.createRenderer()
  it('renders correctly', () => {
    renderer.render(<DisputeDisclaimer />)
    expect(renderer.getRenderOutput()).toMatchSnapshot()
  })
})
