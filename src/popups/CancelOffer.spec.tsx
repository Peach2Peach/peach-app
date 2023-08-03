import { createRenderer } from 'react-test-renderer/shallow'
import { CancelOffer } from './CancelOffer'

describe('CancelOffer', () => {
  const shallowRenderer = createRenderer()
  it('should render correctly for buy offer', () => {
    shallowRenderer.render(<CancelOffer type="bid" />)
    expect(shallowRenderer.getRenderOutput()).toMatchSnapshot()
  })
  it('should render correctly for sell offer', () => {
    shallowRenderer.render(<CancelOffer type="ask" />)
    expect(shallowRenderer.getRenderOutput()).toMatchSnapshot()
  })
})
