import { createRenderer } from 'react-test-renderer/shallow'
import { sellOffer } from '../../../tests/unit/data/offerData'
import { AmountSummary } from './AmountSummary'
import { mockDimensions } from '../../../tests/unit/helpers/mockDimensions'

describe('AmountSummary', () => {
  const renderer = createRenderer()
  it('renders correctly', () => {
    renderer.render(<AmountSummary amount={sellOffer.amount} />)
    expect(renderer.getRenderOutput()).toMatchSnapshot()
  })
  it('renders correctly for md screens', () => {
    mockDimensions({ width: 600, height: 840 })
    renderer.render(<AmountSummary amount={sellOffer.amount} />)
    expect(renderer.getRenderOutput()).toMatchSnapshot()
  })
})
