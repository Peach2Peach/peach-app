import { createRenderer } from 'react-test-renderer/shallow'
import { PaymentMethod } from './PaymentMethod'

describe('PaymentMethod', () => {
  const renderer = createRenderer()
  it('renders correctly', () => {
    renderer.render(<PaymentMethod paymentMethod="sepa" />)
    expect(renderer.getRenderOutput()).toMatchSnapshot()
  })
  it('renders correctly when selected', () => {
    renderer.render(<PaymentMethod paymentMethod="sepa" isSelected />)
    expect(renderer.getRenderOutput()).toMatchSnapshot()
  })
  it('renders correctly when verified', () => {
    renderer.render(<PaymentMethod paymentMethod="sepa" isSelected isVerified />)
    expect(renderer.getRenderOutput()).toMatchSnapshot()
  })
})
