import { createRenderer } from 'react-test-renderer/shallow'
import { SliderKnob } from './SliderKnob'

describe('SliderKnob', () => {
  const shallowRenderer = createRenderer()
  it('should render correctly', () => {
    shallowRenderer.render(<SliderKnob />)
    expect(shallowRenderer.getRenderOutput()).toMatchSnapshot()
  })
})
