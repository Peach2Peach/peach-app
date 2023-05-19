import { createRenderer } from 'react-test-renderer/shallow'
import { BuyOfferMatchPrice } from './BuyOfferMatchPrice'
import { match } from '../../../../tests/unit/data/matchData'
import { buyOffer } from '../../../../tests/unit/data/offerData'

describe('BuyOfferMatchPrice', () => {
  const renderer = createRenderer()
  it('should render correctly', () => {
    renderer.render(<BuyOfferMatchPrice {...{ match, offer: buyOffer }} />)
    expect(renderer.getRenderOutput()).toMatchSnapshot()
  })
})
