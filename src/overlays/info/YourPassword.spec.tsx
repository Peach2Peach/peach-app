import ShallowRenderer from 'react-test-renderer/shallow'
import { YourPassword } from './YourPassword'

describe('YourPassword', () => {
  const renderer = ShallowRenderer.createRenderer()
  it('renders correctly', () => {
    renderer.render(<YourPassword />)
    expect(renderer.getRenderOutput()).toMatchSnapshot()
  })
})
