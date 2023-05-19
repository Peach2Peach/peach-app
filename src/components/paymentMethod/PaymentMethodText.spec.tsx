import { createRenderer } from 'react-test-renderer/shallow'
import { PaymentMethodText } from './PaymentMethodText'

describe('PaymentMethodText', () => {
  const renderer = createRenderer()
  it('renders correctly', () => {
    renderer.render(<PaymentMethodText paymentMethod="sepa" />)
    expect(renderer.getRenderOutput()).toMatchSnapshot()
  })
  it('renders correctly when selected', () => {
    renderer.render(<PaymentMethodText paymentMethod="sepa" isSelected />)
    expect(renderer.getRenderOutput()).toMatchSnapshot()
  })
  it('renders correctly when verified', () => {
    renderer.render(<PaymentMethodText paymentMethod="sepa" isSelected isVerified />)
    expect(renderer.getRenderOutput()).toMatchSnapshot()
  })
})
