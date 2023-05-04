import { createRenderer } from 'react-test-renderer/shallow'
import { TrackMarkers } from './TrackMarkers'

describe('TrackMarkers', () => {
  const shallowRenderer = createRenderer()
  it('should render correctly', () => {
    const labels = { 0: 'Have', 1: 'fun', 2: 'staying', 3: 'poor' }
    shallowRenderer.render(<TrackMarkers {...{ trackHeight: 110, labels }} />)
    expect(shallowRenderer.getRenderOutput()).toMatchSnapshot()
  })
})
