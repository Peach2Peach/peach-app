import { createRenderer } from 'react-test-renderer/shallow'
import { AmountSummaryItem } from './AmountSummaryItem'

describe('AmountSummaryItem', () => {
  const renderer = createRenderer()
  it('renders correctly', () => {
    renderer.render(<AmountSummaryItem amount={12345} />)
    expect(renderer.getRenderOutput()).toMatchSnapshot()
  })
})
