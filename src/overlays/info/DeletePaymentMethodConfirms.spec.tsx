import ShallowRenderer from 'react-test-renderer/shallow'
import { DeletePaymentMethodConfirm } from './DeletePaymentMethodConfirm'

describe('DeletePaymentMethodConfirm', () => {
  const renderer = ShallowRenderer.createRenderer()
  it('renders correctly', () => {
    renderer.render(<DeletePaymentMethodConfirm />)
    expect(renderer.getRenderOutput()).toMatchSnapshot()
  })
})
