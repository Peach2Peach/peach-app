import { createRenderer } from 'react-test-renderer/shallow'
import { SliderTrack } from './SliderTrack'

describe('SliderTrack', () => {
  const shallowRenderer = createRenderer()
  it('should render correctly', () => {
    shallowRenderer.render(<SliderTrack />)
    expect(shallowRenderer.getRenderOutput()).toMatchSnapshot()
  })
})
