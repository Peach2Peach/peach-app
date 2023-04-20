import { CashTradeDetails } from './CashTradeDetails'
import { createRenderer } from 'react-test-renderer/shallow'

describe('CashTradeDetails', () => {
  const renderer = createRenderer()
  it('renders correctly', () => {
    renderer.render(<CashTradeDetails paymentMethod="cash.DE" disputeActive={false} />)
    expect(renderer.getRenderOutput()).toMatchSnapshot()
  })
})
