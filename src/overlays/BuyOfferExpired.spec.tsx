import { createRenderer } from 'react-test-renderer/shallow'
import { BuyOfferExpired } from './BuyOfferExpired'

describe('BuyOfferExpired', () => {
  const shallowRenderer = createRenderer()
  it('should render correctly', () => {
    shallowRenderer.render(<BuyOfferExpired offerId="123" days="30" />)
    expect(shallowRenderer.getRenderOutput()).toMatchSnapshot()
  })
})
