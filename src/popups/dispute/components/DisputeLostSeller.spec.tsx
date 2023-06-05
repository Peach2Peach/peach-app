import { createRenderer } from 'react-test-renderer/shallow'
import { DisputeLostSeller } from './DisputeLostSeller'

describe('DisputeLostSeller', () => {
  const shallowRenderer = createRenderer()
  it('should render correctly when not completed', () => {
    shallowRenderer.render(<DisputeLostSeller tradeId="tradeId" isCompleted={false} />)
    expect(shallowRenderer.getRenderOutput()).toMatchSnapshot()
  })
  it('should render correctly when completed', () => {
    shallowRenderer.render(<DisputeLostSeller tradeId="tradeId" isCompleted />)
    expect(shallowRenderer.getRenderOutput()).toMatchSnapshot()
  })
})
