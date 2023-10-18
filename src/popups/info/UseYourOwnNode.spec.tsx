import ShallowRenderer from 'react-test-renderer/shallow'
import { UseYourOwnNode } from './UseYourOwnNode'

describe('UseYourOwnNode', () => {
  const renderer = ShallowRenderer.createRenderer()
  it('renders correctly', () => {
    renderer.render(<UseYourOwnNode />)
    expect(renderer.getRenderOutput()).toMatchSnapshot()
  })
})
