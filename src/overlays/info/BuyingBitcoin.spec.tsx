import ShallowRenderer from 'react-test-renderer/shallow'
import { BuyingBitcoin } from './BuyingBitcoin'

describe('BuyingBitcoin', () => {
  it('renders correctly', () => {
    const renderer = ShallowRenderer.createRenderer()
    renderer.render(<BuyingBitcoin />)
    const tree = renderer.getRenderOutput()
    expect(tree).toMatchSnapshot()
  })
})
