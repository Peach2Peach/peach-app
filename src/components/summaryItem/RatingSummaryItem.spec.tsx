import { createRenderer } from 'react-test-renderer/shallow'
import { RatingSummaryItem } from './RatingSummaryItem'

describe('RatingSummaryItem', () => {
  const renderer = createRenderer()
  it('renders correctly for positive rating', () => {
    renderer.render(<RatingSummaryItem title="rating" rating={1} />)
    expect(renderer.getRenderOutput()).toMatchSnapshot()
  })
  it('renders correctly for negative rating', () => {
    renderer.render(<RatingSummaryItem title="rating" rating={-1} />)
    expect(renderer.getRenderOutput()).toMatchSnapshot()
  })
})
