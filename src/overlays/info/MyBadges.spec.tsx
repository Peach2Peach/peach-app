import ShallowRenderer from 'react-test-renderer/shallow'
import { MyBadges } from './MyBadges'

describe('MyBadges', () => {
  const renderer = ShallowRenderer.createRenderer()
  it('renders correctly', () => {
    renderer.render(<MyBadges />)
    expect(renderer.getRenderOutput()).toMatchSnapshot()
  })
})
