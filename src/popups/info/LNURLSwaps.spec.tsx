import ShallowRenderer from 'react-test-renderer/shallow'
import { LNURLSwaps } from './LNURLSwaps'

describe('LNURLSwaps', () => {
  const renderer = ShallowRenderer.createRenderer()
  it('renders correctly', () => {
    renderer.render(<LNURLSwaps />)
    expect(renderer.getRenderOutput()).toMatchSnapshot()
  })
})
