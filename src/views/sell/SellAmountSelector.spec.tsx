import { createRenderer } from 'react-test-renderer/shallow'
import { SellAmountSelector } from './SellAmountSelector'

describe('SellAmountSelector', () => {
  it('should render correctly', () => {
    const renderer = createRenderer()
    renderer.render(<SellAmountSelector />)
    expect(renderer.getRenderOutput()).toMatchSnapshot()
  })
})
