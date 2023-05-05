import { createRenderer } from 'react-test-renderer/shallow'
import { TrackMarkers } from './TrackMarkers'

describe('TrackMarkers', () => {
  const shallowRenderer = createRenderer()
  it('should render correctly', () => {
    shallowRenderer.render(<TrackMarkers />)
    expect(shallowRenderer.getRenderOutput()).toMatchSnapshot()
  })
})
