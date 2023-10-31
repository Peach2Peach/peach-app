import { createRenderer } from 'react-test-renderer/shallow'
import { BuyAmountSelector } from './BuyAmountSelector'

describe('BuyAmountSelector', () => {
  it('should render correctly', () => {
    const renderer = createRenderer()
    renderer.render(<BuyAmountSelector />)
    const result = renderer.getRenderOutput()
    expect(result).toMatchSnapshot()
  })
})
