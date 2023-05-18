import { createRenderer } from 'react-test-renderer/shallow'
import { buyOffer } from '../../../tests/unit/data/offerData'
import { BuyOfferSummary } from './BuyOfferSummary'
import { getBuyOfferDraft } from '../../../tests/unit/data/offerDraftData'

jest.useFakeTimers({ now: new Date('2022-12-30T23:00:00.000Z') })
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
