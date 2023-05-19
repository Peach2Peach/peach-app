import { createRenderer } from 'react-test-renderer/shallow'
import { match } from '../../../../tests/unit/data/matchData'
import { sellOffer } from '../../../../tests/unit/data/offerData'
import { SellOfferMatchPrice } from './SellOfferMatchPrice'

describe('SellOfferMatchPrice', () => {
  const renderer = createRenderer()
  it('should render correctly', () => {
    renderer.render(<SellOfferMatchPrice {...{ match, offer: sellOffer }} />)
    expect(renderer.getRenderOutput()).toMatchSnapshot()
  })
})
