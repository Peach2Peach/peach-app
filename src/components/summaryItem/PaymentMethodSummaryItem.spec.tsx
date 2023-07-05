import { createRenderer } from 'react-test-renderer/shallow'
import { PaymentMethodSummaryItem } from './PaymentMethodSummaryItem'

describe('PaymentMethodSummaryItem', () => {
  const renderer = createRenderer()
  it('renders correctly', () => {
    renderer.render(<PaymentMethodSummaryItem title="payment method" paymentMethod="sepa" />)
    expect(renderer.getRenderOutput()).toMatchSnapshot()
  })
})
