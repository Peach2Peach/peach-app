import { createRenderer } from 'react-test-renderer/shallow'
import { wronglyFundedSellOffer } from '../../../../tests/unit/data/offerData'
import { WrongFundingAmountSummary } from './WrongFundingAmountSummary'

describe('WrongFundingAmountSummary', () => {
  const renderer = createRenderer()
  it('renders correctly', () => {
    renderer.render(<WrongFundingAmountSummary sellOffer={wronglyFundedSellOffer} />)
    expect(renderer.getRenderOutput()).toMatchSnapshot()
  })
})
