import { createRenderer } from 'react-test-renderer/shallow'
import { OfferOutsideRange } from './OfferOutsideRange'

describe('OfferOutsideRange', () => {
  const shallowRenderer = createRenderer()
  it('should render correctly', () => {
    shallowRenderer.render(<OfferOutsideRange offerId="123" />)
    expect(shallowRenderer.getRenderOutput()).toMatchSnapshot()
  })
})
