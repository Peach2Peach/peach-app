import ShallowRenderer from 'react-test-renderer/shallow'
import { Premium } from './Premium'

describe('Premium', () => {
  const renderer = ShallowRenderer.createRenderer()
  it('renders correctly', () => {
    renderer.render(<Premium />)
    expect(renderer.getRenderOutput()).toMatchSnapshot()
  })
})
