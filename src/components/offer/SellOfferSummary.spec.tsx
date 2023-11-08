import { createRenderer } from 'react-test-renderer/shallow'
import { sellOffer } from '../../../tests/unit/data/offerData'
import { SellOfferSummary } from './SellOfferSummary'

jest.useFakeTimers({ now: new Date('2023-04-26T14:58:49.437Z') })

describe('SellOfferSummary', () => {
  const renderer = createRenderer()

  it('renders correctly', () => {
    renderer.render(<SellOfferSummary offer={sellOffer} />)
    expect(renderer.getRenderOutput()).toMatchSnapshot()
  })

  it('renders correctly when the premium is 0', () => {
    renderer.render(<SellOfferSummary offer={{ ...sellOffer, premium: 0 }} />)
    expect(renderer.getRenderOutput()).toMatchSnapshot()
  })
  it('renders correctly when funding multiple offers', () => {
    renderer.render(<SellOfferSummary offer={sellOffer} numberOfOffers={5} />)
    expect(renderer.getRenderOutput()).toMatchSnapshot()
  })
})
