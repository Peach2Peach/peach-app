import { createRenderer } from 'react-test-renderer/shallow'
import { PremiumSlider } from './PremiumSlider'

describe('PremiumSlider', () => {
  const shallowRenderer = createRenderer()
  it('should render correctly', () => {
    shallowRenderer.render(<PremiumSlider />)
    expect(shallowRenderer.getRenderOutput()).toMatchSnapshot()
  })
})
