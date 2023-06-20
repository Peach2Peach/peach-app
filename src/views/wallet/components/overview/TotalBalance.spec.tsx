import ShallowRenderer from 'react-test-renderer/shallow'
import { TotalBalance } from './TotalBalance'

describe('TotalBalance', () => {
  const renderer = ShallowRenderer.createRenderer()
  it('renders correctly', () => {
    renderer.render(<TotalBalance amount={100000} />)
    expect(renderer.getRenderOutput()).toMatchSnapshot()
  })
})
