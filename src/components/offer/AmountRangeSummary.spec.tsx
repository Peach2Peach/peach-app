import { createRenderer } from 'react-test-renderer/shallow'
import { buyOffer } from '../../../tests/unit/data/offerData'
import { AmountRangeSummary } from './AmountRangeSummary'
import { mockDimensions } from '../../../tests/unit/helpers/mockDimensions'

describe('AmountRangeSummary', () => {
  const renderer = createRenderer()
  it('renders correctly', () => {
    renderer.render(<AmountRangeSummary amount={buyOffer.amount} />)
    expect(renderer.getRenderOutput()).toMatchSnapshot()
  })
  it('renders correctly for md screens', () => {
    mockDimensions({ width: 600, height: 840 })
    renderer.render(<AmountRangeSummary amount={buyOffer.amount} />)
    expect(renderer.getRenderOutput()).toMatchSnapshot()
  })
})
