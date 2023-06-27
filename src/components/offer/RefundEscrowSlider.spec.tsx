import { createRenderer } from 'react-test-renderer/shallow'
import { sellOffer } from '../../../tests/unit/data/offerData'
import { RefundEscrowSlider } from './RefundEscrowSlider'
import { render } from '@testing-library/react-native'
import { fireSwipeEvent } from '../../../tests/unit/helpers/fireSwipeEvent'

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
  it('opens refund popup', () => {
    const { getByTestId } = render(<RefundEscrowSlider sellOffer={sellOffer} />)
    fireSwipeEvent({ element: getByTestId('confirmSlider'), x: 260 })
    expect(startRefundPopupMock).toHaveBeenCalledWith(sellOffer)
  })
})
