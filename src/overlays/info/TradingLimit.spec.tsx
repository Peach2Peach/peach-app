import ShallowRenderer from 'react-test-renderer/shallow'
import { TradingLimit } from './TradingLimit'

describe('TradingLimit', () => {
  const renderer = ShallowRenderer.createRenderer()
  it('renders correctly', () => {
    renderer.render(<TradingLimit />)
    expect(renderer.getRenderOutput()).toMatchSnapshot()
  })
})
