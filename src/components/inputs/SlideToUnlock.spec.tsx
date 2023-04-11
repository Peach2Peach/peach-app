import { SlideToUnlock } from './SlideToUnlock'
import { createRenderer } from 'react-test-renderer/shallow'

describe('SlideToUnlock', () => {
  const renderer = createRenderer()
  it('renders correctly', () => {
    renderer.render(<SlideToUnlock label1="label1" label2="label2" onUnlock={() => {}} />)
    expect(renderer.getRenderOutput()).toMatchSnapshot()
  })
  it('renders correctly when disabled', () => {
    renderer.render(<SlideToUnlock label1="label1" label2="label2" onUnlock={() => {}} disabled />)
    expect(renderer.getRenderOutput()).toMatchSnapshot()
  })
})
