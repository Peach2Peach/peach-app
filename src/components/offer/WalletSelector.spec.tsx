import { createRenderer } from 'react-test-renderer/shallow'
import { buyOffer, sellOffer } from '../../../tests/unit/data/offerData'
import { getBuyOfferDraft, getSellOfferDraft } from '../../../tests/unit/data/offerDraftData'
import { WalletSelector } from './WalletSelector'

describe('WalletSelector', () => {
  const shallowRenderer = createRenderer()
  it('should render correctly if for buy offer draft', () => {
    shallowRenderer.render(<WalletSelector offer={getBuyOfferDraft()} />)
    expect(shallowRenderer.getRenderOutput()).toMatchSnapshot()
  })
  it('should render correctly if for sell offer draft', () => {
    shallowRenderer.render(<WalletSelector offer={getSellOfferDraft()} />)
    expect(shallowRenderer.getRenderOutput()).toMatchSnapshot()
  })
  it('should render correctly if for buy offer', () => {
    shallowRenderer.render(<WalletSelector offer={buyOffer} />)
    expect(shallowRenderer.getRenderOutput()).toMatchSnapshot()
  })
  it('should render correctly if for sell offer', () => {
    shallowRenderer.render(<WalletSelector offer={sellOffer} />)
    expect(shallowRenderer.getRenderOutput()).toMatchSnapshot()
  })
})
