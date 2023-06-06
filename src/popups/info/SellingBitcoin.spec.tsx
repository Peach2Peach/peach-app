import ShallowRenderer from 'react-test-renderer/shallow'
import { SellingBitcoin } from './SellingBitcoin'

describe('SellingBitcoin', () => {
  const renderer = ShallowRenderer.createRenderer()
  it('renders correctly', () => {
    renderer.render(<SellingBitcoin />)
    expect(renderer.getRenderOutput()).toMatchSnapshot()
  })
})
