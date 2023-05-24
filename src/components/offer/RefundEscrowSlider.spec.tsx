import { createRenderer } from 'react-test-renderer/shallow'
import { sellOffer } from '../../../tests/unit/data/offerData'
import { RefundEscrowSlider } from './RefundEscrowSlider'

const startRefundOverlayMock = jest.fn()
jest.mock('../../overlays/useStartRefundOverlay', () => ({
  useStartRefundOverlay:
    () =>
      (...args: any[]) =>
        startRefundOverlayMock(...args),
}))

describe('RefundEscrowSlider', () => {
  const renderer = createRenderer()
  beforeEach(() => {
    jest.clearAllMocks()
  })
  it('renders correctly', () => {
    renderer.render(<RefundEscrowSlider sellOffer={sellOffer} />)
    expect(renderer.getRenderOutput()).toMatchSnapshot()
  })
})
