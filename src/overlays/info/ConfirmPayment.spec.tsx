import ShallowRenderer from 'react-test-renderer/shallow'
import { ConfirmPayment } from './ConfirmPayment'

describe('ConfirmPayment', () => {
  const renderer = ShallowRenderer.createRenderer()
  it('renders correctly', () => {
    renderer.render(<ConfirmPayment />)
    expect(renderer.getRenderOutput()).toMatchSnapshot()
  })
})
