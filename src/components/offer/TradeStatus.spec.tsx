import { TradeStatus } from './TradeStatus'
import { createRenderer } from 'react-test-renderer/shallow'

describe('TradeStatus', () => {
  const renderer = createRenderer()
  it('renders correctly', () => {
    renderer.render(<TradeStatus disputeActive={false} />)
    expect(renderer.getRenderOutput()).toMatchSnapshot()
  })
  it('renders correctly when there is a dispute', () => {
    renderer.render(<TradeStatus disputeActive />)
    expect(renderer.getRenderOutput()).toMatchSnapshot()
  })
})
