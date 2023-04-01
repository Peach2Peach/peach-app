import { createRenderer } from 'react-test-renderer/shallow'
import { NotificationBubble } from './NotificationBubble'

describe('NotificationBubble', () => {
  it('should render a notification bubble', () => {
    const renderer = createRenderer()

    renderer.render(<NotificationBubble notifications={1} />)
    const result = renderer.getRenderOutput()
    expect(result).toMatchSnapshot()
  })
  it('should render a maximum of 99', () => {
    const renderer = createRenderer()

    renderer.render(<NotificationBubble notifications={615} />)
    const result = renderer.getRenderOutput()
    expect(result).toMatchSnapshot()
  })
})
