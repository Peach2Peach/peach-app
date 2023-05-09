import { createRenderer } from 'react-test-renderer/shallow'
import { BuyTitleComponent } from './BuyTitleComponent'

describe('BuyTitleComponent', () => {
  const shallowRenderer = createRenderer()
  it('should render correctly', () => {
    shallowRenderer.render(<BuyTitleComponent />)
    expect(shallowRenderer.getRenderOutput()).toMatchSnapshot()
  })
})
