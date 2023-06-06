import { createRenderer } from 'react-test-renderer/shallow'
import { DisputeRaisedSuccess } from './DisputeRaisedSuccess'

describe('DisputeRaisedSuccess', () => {
  const shallowRenderer = createRenderer()
  it('should render correctly for buyer', () => {
    shallowRenderer.render(<DisputeRaisedSuccess view="buyer" />)
    expect(shallowRenderer.getRenderOutput()).toMatchSnapshot()
  })
  it('should render correctly for seller', () => {
    shallowRenderer.render(<DisputeRaisedSuccess view="seller" />)
    expect(shallowRenderer.getRenderOutput()).toMatchSnapshot()
  })
})
