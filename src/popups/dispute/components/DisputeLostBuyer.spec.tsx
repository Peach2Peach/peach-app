import { createRenderer } from 'react-test-renderer/shallow'
import { DisputeLostBuyer } from './DisputeLostBuyer'

describe('DisputeLostBuyer', () => {
  const shallowRenderer = createRenderer()
  it('should render correctly', () => {
    shallowRenderer.render(<DisputeLostBuyer tradeId="tradeId" />)
    expect(shallowRenderer.getRenderOutput()).toMatchSnapshot()
  })
})
