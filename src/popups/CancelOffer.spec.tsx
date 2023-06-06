import { createRenderer } from 'react-test-renderer/shallow'
import { CancelOffer } from './CancelOffer'
import { buyOffer, sellOffer } from '../../tests/unit/data/offerData'

describe('CancelOffer', () => {
  const shallowRenderer = createRenderer()
  it('should render correctly for buy offer', () => {
    shallowRenderer.render(<CancelOffer offer={buyOffer} />)
    expect(shallowRenderer.getRenderOutput()).toMatchSnapshot()
  })
  it('should render correctly for sell offer', () => {
    shallowRenderer.render(<CancelOffer offer={sellOffer} />)
    expect(shallowRenderer.getRenderOutput()).toMatchSnapshot()
  })
})
