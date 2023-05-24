import { createRenderer } from 'react-test-renderer/shallow'
import { SellTitleComponent } from './SellTitleComponent'

describe('SellTitleComponent', () => {
  const shallowRenderer = createRenderer()
  it('should render correctly', () => {
    shallowRenderer.render(<SellTitleComponent />)
    expect(shallowRenderer.getRenderOutput()).toMatchSnapshot()
  })
})
