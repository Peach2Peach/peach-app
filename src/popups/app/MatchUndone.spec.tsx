import { createRenderer } from 'react-test-renderer/shallow'
import { MatchUndone } from './MatchUndone'

describe('MatchUndone', () => {
  const shallowRenderer = createRenderer()
  it('should render correctly', () => {
    shallowRenderer.render(<MatchUndone />)
    expect(shallowRenderer.getRenderOutput()).toMatchSnapshot()
  })
})
