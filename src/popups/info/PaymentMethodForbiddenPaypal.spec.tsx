import ShallowRenderer from 'react-test-renderer/shallow'
import { PaymentMethodForbiddenPaypal } from './PaymentMethodForbiddenPaypal'

describe('PaymentMethodForbiddenPaypal', () => {
  const renderer = ShallowRenderer.createRenderer()
  it('renders correctly', () => {
    renderer.render(<PaymentMethodForbiddenPaypal />)
    expect(renderer.getRenderOutput()).toMatchSnapshot()
  })
})
