import { createRenderer } from 'react-test-renderer/shallow'
import { RefundCashTrade } from './RefundCashTrade'

describe('RefundCashTrade', () => {
  it('renders correctly', () => {
    const renderer = createRenderer()
    renderer.render(<RefundCashTrade tradeID="tradeID" walletName="walletName" />)
    expect(renderer.getRenderOutput()).toMatchSnapshot()
  })
})
