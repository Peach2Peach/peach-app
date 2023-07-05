import { createRenderer } from 'react-test-renderer/shallow'
import { CopyableSummaryItem } from './CopyableSummaryItem'

describe('CopyableSummaryItem', () => {
  const renderer = createRenderer()
  it('renders correctly', () => {
    renderer.render(<CopyableSummaryItem title="rating" text="text" />)
    expect(renderer.getRenderOutput()).toMatchSnapshot()
  })
})
