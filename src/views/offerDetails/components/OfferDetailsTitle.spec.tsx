import { createRenderer } from 'react-test-renderer/shallow'
import { OfferDetailsTitle } from './OfferDetailsTitle'

describe('OfferDetailsTitle', () => {
  const shallowRenderer = createRenderer()
  it('should render correctly', () => {
    shallowRenderer.render(<OfferDetailsTitle id="123" />)
    expect(shallowRenderer.getRenderOutput()).toMatchSnapshot()
  })
})
