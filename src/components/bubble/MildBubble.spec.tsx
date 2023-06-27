import { createRenderer } from 'react-test-renderer/shallow'
import { MildBubble } from './MildBubble'

describe('MildBubble', () => {
  const shallowRenderer = createRenderer()
  it('should render correctly', () => {
    shallowRenderer.render(<MildBubble>Text</MildBubble>)
    expect(shallowRenderer.getRenderOutput()).toMatchSnapshot()
  })
  it('should render correctly with icon', () => {
    shallowRenderer.render(<MildBubble iconId="chevronsUp">Text</MildBubble>)
    expect(shallowRenderer.getRenderOutput()).toMatchSnapshot()
  })
  it('should render correctly with no background', () => {
    shallowRenderer.render(<MildBubble border>Text</MildBubble>)
    expect(shallowRenderer.getRenderOutput()).toMatchSnapshot()
  })
})
