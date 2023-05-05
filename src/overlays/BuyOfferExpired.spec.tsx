import { createRenderer } from 'react-test-renderer/shallow'
import { BuyOfferExpired } from './BuyOfferExpired'

describe('BuyOfferExpired', () => {
  const shallowRenderer = createRenderer()
  it('should render correctly', () => {
    shallowRenderer.render(<BuyOfferExpired offerId="P‑7B" days="30" />)
    expect(shallowRenderer.getRenderOutput()).toMatchSnapshot()
  })
})
