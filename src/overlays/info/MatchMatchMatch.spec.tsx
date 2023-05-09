import ShallowRenderer from 'react-test-renderer/shallow'
import { MatchMatchMatch } from './MatchMatchMatch'

describe('MatchMatchMatch', () => {
  const renderer = ShallowRenderer.createRenderer()
  it('renders correctly', () => {
    renderer.render(<MatchMatchMatch />)
    expect(renderer.getRenderOutput()).toMatchSnapshot()
  })
})
