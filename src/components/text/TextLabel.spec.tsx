import ShallowRenderer from 'react-test-renderer/shallow'
import { TextLabel } from './TextLabel'

describe('TextLabel', () => {
  const renderer = ShallowRenderer.createRenderer()
  it('renders correctly', () => {
    renderer.render(<TextLabel onPress={jest.fn()}>Test</TextLabel>)
    expect(renderer.getRenderOutput()).toMatchSnapshot()
  })
})
