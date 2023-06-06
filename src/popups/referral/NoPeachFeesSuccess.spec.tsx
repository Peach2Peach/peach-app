import { createRenderer } from 'react-test-renderer/shallow'
import { NoPeachFeesSuccess } from './NoPeachFeesSuccess'

describe('NoPeachFeesSuccess', () => {
  const shallowRenderer = createRenderer()
  it('should render correctly', () => {
    shallowRenderer.render(<NoPeachFeesSuccess />)
    expect(shallowRenderer.getRenderOutput()).toMatchSnapshot()
  })
})
