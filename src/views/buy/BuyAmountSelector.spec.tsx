import { BuyAmountSelector } from './BuyAmountSelector'
import { createRenderer } from 'react-test-renderer/shallow'

describe('BuyAmountSelector', () => {
  it('should render correctly', () => {
    const renderer = createRenderer()
    renderer.render(<BuyAmountSelector />)
    const result = renderer.getRenderOutput()
    expect(result).toMatchSnapshot()
  })
})
