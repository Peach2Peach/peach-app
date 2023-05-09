import { createRenderer } from 'react-test-renderer/shallow'
import { NoPeachFees } from './NoPeachFees'

describe('NoPeachFees', () => {
  const shallowRenderer = createRenderer()
  it('should render correctly', () => {
    shallowRenderer.render(<NoPeachFees />)
    expect(shallowRenderer.getRenderOutput()).toMatchSnapshot()
  })
})
