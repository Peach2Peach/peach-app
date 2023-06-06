import ShallowRenderer from 'react-test-renderer/shallow'
import { AcceptMatchPopup } from './AcceptMatchPopup'

describe('AcceptMatchPopup', () => {
  const renderer = ShallowRenderer.createRenderer()
  it('renders correctly', () => {
    renderer.render(<AcceptMatchPopup />)
    expect(renderer.getRenderOutput()).toMatchSnapshot()
  })
})
