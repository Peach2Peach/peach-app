import ShallowRenderer from 'react-test-renderer/shallow'
import { Mempool } from './Mempool'

describe('Mempool', () => {
  const renderer = ShallowRenderer.createRenderer()
  it('renders correctly', () => {
    renderer.render(<Mempool />)
    expect(renderer.getRenderOutput()).toMatchSnapshot()
  })
})
