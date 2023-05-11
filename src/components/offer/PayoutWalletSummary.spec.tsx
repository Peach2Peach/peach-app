import { createRenderer } from 'react-test-renderer/shallow'
import { buyOffer } from '../../../tests/unit/data/offerData'
import { PayoutWalletSummary } from './PayoutWalletSummary'
import { getBuyOfferDraft } from '../../../tests/unit/data/offerDraftData'

describe('PayoutWalletSummary', () => {
  const renderer = createRenderer()
  it('renders correctly', () => {
    renderer.render(<PayoutWalletSummary offer={buyOffer} />)
    expect(renderer.getRenderOutput()).toMatchSnapshot()
  })
  it('renders correctly for offer draft', () => {
    renderer.render(<PayoutWalletSummary offer={getBuyOfferDraft()} />)
    expect(renderer.getRenderOutput()).toMatchSnapshot()
  })
})
