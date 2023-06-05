import { createRenderer } from 'react-test-renderer/shallow'
import { sellOffer } from '../../../tests/unit/data/offerData'
import { RefundEscrowSlider } from './RefundEscrowSlider'

const startRefundPopupMock = jest.fn()
jest.mock('../../overlays/useStartRefundPopup', () => ({
  useStartRefundPopup:
    () =>
      (...args: any[]) =>
        startRefundPopupMock(...args),
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
