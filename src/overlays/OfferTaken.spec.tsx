import { createRenderer } from 'react-test-renderer/shallow'
import { OfferTaken } from './OfferTaken'

describe('OfferTaken', () => {
  const shallowRenderer = createRenderer()
  it('should render correctly', () => {
    shallowRenderer.render(<OfferTaken />)
    expect(shallowRenderer.getRenderOutput()).toMatchSnapshot()
  })
})
