import { createRenderer } from 'react-test-renderer/shallow'
import { PrimaryBubble } from './PrimaryBubble'

describe('PrimaryBubble', () => {
  const shallowRenderer = createRenderer()
  it('should render correctly', () => {
    shallowRenderer.render(<PrimaryBubble>Text</PrimaryBubble>)
    expect(shallowRenderer.getRenderOutput()).toMatchSnapshot()
  })
  it('should render correctly with icon', () => {
    shallowRenderer.render(<PrimaryBubble iconId="chevronsUp">Text</PrimaryBubble>)
    expect(shallowRenderer.getRenderOutput()).toMatchSnapshot()
  })
  it('should render correctly with no background', () => {
    shallowRenderer.render(<PrimaryBubble border>Text</PrimaryBubble>)
    expect(shallowRenderer.getRenderOutput()).toMatchSnapshot()
  })
})
