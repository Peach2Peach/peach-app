import { createRenderer } from 'react-test-renderer/shallow'
import { SellOfferTitle } from './SellOfferTitle'

describe('SellOfferTitle', () => {
  const shallowRenderer = createRenderer()
  it('renders correctly', () => {
    shallowRenderer.render(<SellOfferTitle />)
    expect(shallowRenderer.getRenderOutput()).toMatchSnapshot()
  })
  it('renders correctly for multiple matches', () => {
    shallowRenderer.render(<SellOfferTitle plural />)
    expect(shallowRenderer.getRenderOutput()).toMatchSnapshot()
  })
})
