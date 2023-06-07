import ShallowRenderer from 'react-test-renderer/shallow'
import { PaymentMethodsHelp } from './PaymentMethodsHelp'

describe('PaymentMethodsHelp', () => {
  const renderer = ShallowRenderer.createRenderer()
  it('renders correctly', () => {
    renderer.render(<PaymentMethodsHelp />)
    expect(renderer.getRenderOutput()).toMatchSnapshot()
  })
})
