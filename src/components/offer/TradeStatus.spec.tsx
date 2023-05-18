import { TradeStatus } from './TradeStatus'
import { createRenderer } from 'react-test-renderer/shallow'

describe('TradeStatus', () => {
  const renderer = createRenderer()
  it('renders correctly', () => {
    renderer.render(<TradeStatus disputeActive={false} tradeStatus={'searchingForPeer'} />)
    expect(renderer.getRenderOutput()).toMatchSnapshot()
  })
  it('renders correctly when there is a dispute', () => {
    renderer.render(<TradeStatus disputeActive tradeStatus="dispute" />)
    expect(renderer.getRenderOutput()).toMatchSnapshot()
  })
  it('renders correctly for confirmPaymentRequired', () => {
    renderer.render(<TradeStatus disputeActive={false} tradeStatus={'confirmPaymentRequired'} />)
    expect(renderer.getRenderOutput()).toMatchSnapshot()
  })
})
