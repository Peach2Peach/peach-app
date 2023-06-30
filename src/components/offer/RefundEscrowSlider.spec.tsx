import { render } from '@testing-library/react-native'
import { createRenderer } from 'react-test-renderer/shallow'
import { sellOffer } from '../../../tests/unit/data/offerData'
import { fireSwipeEvent } from '../../../tests/unit/helpers/fireSwipeEvent'
import { RefundEscrowSlider } from './RefundEscrowSlider'

const startRefundPopupMock = jest.fn()
jest.mock('../../popups/useStartRefundPopup', () => ({
  useStartRefundPopup: () => startRefundPopupMock,
}))

describe('RefundEscrowSlider', () => {
  const renderer = createRenderer()
  it('renders correctly', () => {
    renderer.render(<RefundEscrowSlider sellOffer={sellOffer} />)
    expect(renderer.getRenderOutput()).toMatchSnapshot()
  })
  it('should call startRefundPopupMock when swiped', () => {
    const { getByTestId } = render(<RefundEscrowSlider sellOffer={sellOffer} />)
    fireSwipeEvent({ element: getByTestId('confirmSlider'), x: 270 })
    expect(startRefundPopupMock).toHaveBeenCalled()
  })
})
