import ShallowRenderer from 'react-test-renderer/shallow'
import { PayoutAddressPopup } from './PayoutAddressPopup'

describe('PayoutAddressPopup', () => {
  const renderer = ShallowRenderer.createRenderer()
  it('renders correctly', () => {
    renderer.render(<PayoutAddressPopup />)
    expect(renderer.getRenderOutput()).toMatchSnapshot()
  })
})
