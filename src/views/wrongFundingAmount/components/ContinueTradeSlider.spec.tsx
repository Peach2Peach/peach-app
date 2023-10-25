import { createRenderer } from 'react-test-renderer/shallow'
import { render } from 'test-utils'
import { sellOffer } from '../../../../tests/unit/data/offerData'
import { fireSwipeEvent } from '../../../../tests/unit/helpers/fireSwipeEvent'
import { ContinueTradeSlider } from './ContinueTradeSlider'

const confirmEscrowMock = jest.fn()
jest.mock('../hooks/useConfirmEscrow', () => ({
  useConfirmEscrow:
    () =>
      (...args: unknown[]) =>
        confirmEscrowMock(...args),
}))

describe('ContinueTradeSlider', () => {
  const renderer = createRenderer()
  it('renders correctly', () => {
    renderer.render(<ContinueTradeSlider sellOffer={sellOffer} />)
    expect(renderer.getRenderOutput()).toMatchSnapshot()
  })
  it('renders correctly when no sell offer is known', () => {
    renderer.render(<ContinueTradeSlider sellOffer={undefined} />)
    expect(renderer.getRenderOutput()).toMatchSnapshot()
  })
  it('confirms escrow', () => {
    const { getByTestId } = render(<ContinueTradeSlider sellOffer={sellOffer} />)
    fireSwipeEvent({ element: getByTestId('confirmSlider'), x: 260 })
    expect(confirmEscrowMock).toHaveBeenCalledWith(sellOffer)
  })
})
