import ShallowRenderer from 'react-test-renderer/shallow'
import { Escrow } from './Escrow'

describe('Escrow', () => {
  const renderer = ShallowRenderer.createRenderer()
  it('renders correctly', () => {
    renderer.render(<Escrow />)
    expect(renderer.getRenderOutput()).toMatchSnapshot()
  })
})
