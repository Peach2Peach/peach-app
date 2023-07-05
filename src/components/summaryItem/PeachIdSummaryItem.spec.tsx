import { createRenderer } from 'react-test-renderer/shallow'
import { PeachIdSummaryItem } from './PeachIdSummaryItem'

describe('PeachIdSummaryItem', () => {
  const renderer = createRenderer()
  it('renders correctly', () => {
    renderer.render(<PeachIdSummaryItem title="user" id="userId" />)
    expect(renderer.getRenderOutput()).toMatchSnapshot()
  })
})
