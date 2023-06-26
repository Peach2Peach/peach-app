import ShallowRenderer from 'react-test-renderer/shallow'
import { RBFHelp } from './RBFHelp'

describe('RBFHelp', () => {
  const renderer = ShallowRenderer.createRenderer()
  it('renders correctly', () => {
    renderer.render(<RBFHelp />)
    expect(renderer.getRenderOutput()).toMatchSnapshot()
  })
})
