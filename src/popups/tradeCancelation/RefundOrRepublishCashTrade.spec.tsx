import { createRenderer } from 'react-test-renderer/shallow'
import { RefundOrRepublishCashTrade } from './RefundOrRepublishCashTrade'

describe('RefundOrRepublishCashTrade', () => {
  const renderer = createRenderer()

  it('renders correctly', () => {
    renderer.render(<RefundOrRepublishCashTrade />)
    expect(renderer.getRenderOutput()).toMatchSnapshot()
  })
})
