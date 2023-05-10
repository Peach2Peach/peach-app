import { createRenderer } from 'react-test-renderer/shallow'
import { buyOffer } from '../../../tests/unit/data/offerData'
import { BuyOfferSummary } from './BuyOfferSummary'
import { getBuyOfferDraft } from '../../../tests/unit/data/offerDraftData'

describe('BuyOfferSummary', () => {
  const renderer = createRenderer()
  it('renders correctly', () => {
    renderer.render(<BuyOfferSummary offer={buyOffer} />)
    expect(renderer.getRenderOutput()).toMatchSnapshot()
  })
  it('renders correctly for offer draft', () => {
    renderer.render(<BuyOfferSummary offer={getBuyOfferDraft()} />)
    expect(renderer.getRenderOutput()).toMatchSnapshot()
  })
})
