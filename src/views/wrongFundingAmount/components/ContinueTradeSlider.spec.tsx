import { createRenderer } from 'react-test-renderer/shallow'
import { ContinueTradeSlider } from './ContinueTradeSlider'

describe('ContinueTradeSlider', () => {
  const renderer = createRenderer()
  it('renders correctly', () => {
    renderer.render(<ContinueTradeSlider onUnlock={jest.fn()} />)
    expect(renderer.getRenderOutput()).toMatchSnapshot()
  })
})
