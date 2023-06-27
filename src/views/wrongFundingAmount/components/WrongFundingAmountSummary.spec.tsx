import { createRenderer } from 'react-test-renderer/shallow'
import { WrongFundingAmountSummary } from './WrongFundingAmountSummary'
import { sellOffer } from '../../../../tests/unit/data/offerData'

describe('WrongFundingAmountSummary', () => {
  const renderer = createRenderer()
  it('renders correctly', () => {
    renderer.render(<WrongFundingAmountSummary sellOffer={sellOffer} />)
    expect(renderer.getRenderOutput()).toMatchSnapshot()
  })
})
