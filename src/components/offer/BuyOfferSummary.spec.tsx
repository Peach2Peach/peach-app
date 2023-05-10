import { createRenderer } from 'react-test-renderer/shallow'
import { buyOffer } from '../../../tests/unit/data/offerData'
import { BuyOfferSummary } from './BuyOfferSummary'

describe('BuyOfferSummary', () => {
  const renderer = createRenderer()
  it('renders correctly', () => {
    renderer.render(<BuyOfferSummary offer={buyOffer} />)
    expect(renderer.getRenderOutput()).toMatchSnapshot()
  })
})
