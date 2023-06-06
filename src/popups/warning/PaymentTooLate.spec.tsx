import ShallowRenderer from 'react-test-renderer/shallow'
import { PaymentTooLate } from './PaymentTooLate'

describe('PaymentTooLate', () => {
  const renderer = ShallowRenderer.createRenderer()
  it('renders correctly', () => {
    renderer.render(<PaymentTooLate />)
    expect(renderer.getRenderOutput()).toMatchSnapshot()
  })
})
