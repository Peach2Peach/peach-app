import ShallowRenderer from 'react-test-renderer/shallow'
import { TradeBreakdownSats } from './TradeBreakdownSats'

describe('TradeBreakdownSats', () => {
  it('renders correctly', () => {
    const renderer = ShallowRenderer.createRenderer()
    renderer.render(<TradeBreakdownSats amount={210000} />)
    expect(renderer.getRenderOutput()).toMatchSnapshot()
  })
})
