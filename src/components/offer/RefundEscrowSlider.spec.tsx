import { createRenderer } from 'react-test-renderer/shallow'
import { sellOffer } from '../../../tests/unit/data/offerData'
import { RefundEscrowSlider } from './RefundEscrowSlider'

const startRefundPopupMock = jest.fn()
jest.mock('../../popups/useStartRefundPopup', () => ({
  useStartRefundPopup:
    () =>
      (...args: any[]) =>
        startRefundPopupMock(...args),
}))

describe('RefundEscrowSlider', () => {
  const renderer = createRenderer()
  it('renders correctly', () => {
    renderer.render(<RefundEscrowSlider sellOffer={sellOffer} />)
    expect(renderer.getRenderOutput()).toMatchSnapshot()
  })
})
