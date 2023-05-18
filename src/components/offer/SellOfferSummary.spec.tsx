import { createRenderer } from 'react-test-renderer/shallow'
import { sellOffer } from '../../../tests/unit/data/offerData'
import { SellOfferSummary } from './SellOfferSummary'
import { getSellOfferDraft } from '../../../tests/unit/data/offerDraftData'

jest.useFakeTimers({ now: new Date('2022-12-30T23:00:00.000Z') })

describe('SellOfferSummary', () => {
  const renderer = createRenderer()
  it('renders correctly', () => {
    renderer.render(<SellOfferSummary offer={sellOffer} />)
    expect(renderer.getRenderOutput()).toMatchSnapshot()
  })
  it('renders correctly for offer draft', () => {
    renderer.render(<SellOfferSummary offer={getSellOfferDraft()} />)
    expect(renderer.getRenderOutput()).toMatchSnapshot()
  })
})
