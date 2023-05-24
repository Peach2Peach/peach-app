import { createRenderer } from 'react-test-renderer/shallow'
import { UnmatchPopup } from './UnmatchPopup'

describe('UnmatchPopup', () => {
  const shallowRenderer = createRenderer()
  it('should render correctly', () => {
    shallowRenderer.render(<UnmatchPopup />)
    expect(shallowRenderer.getRenderOutput()).toMatchSnapshot()
  })
})
