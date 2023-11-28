import { fireEvent, render } from 'test-utils'
import { goBackMock, replaceMock } from '../../../tests/unit/helpers/NavigationWrapper'
import { OfferPublished } from './OfferPublished'

const offerId = '123'
const useRouteMock = jest.fn().mockReturnValue({ params: { offerId, isSellOffer: false, shouldGoBack: false } })
jest.mock('../../hooks/useRoute', () => ({
  useRoute: () => useRouteMock(),
}))

describe('OfferPublished', () => {
  it('renders correctly', () => {
    const { toJSON } = render(<OfferPublished />)
    expect(toJSON()).toMatchSnapshot()
  })

  it('should go to search when pressing show offer button', () => {
    const { getByText } = render(<OfferPublished />)
    const button = getByText('show offer')
    fireEvent.press(button)
    expect(replaceMock).toHaveBeenCalledWith('search', { offerId })
  })
  it('should go back to buy for buy offers when pressing back close button', () => {
    const { getByText } = render(<OfferPublished />)
    const closeButton = getByText('close')
    fireEvent.press(closeButton)
    expect(replaceMock).toHaveBeenCalledWith('home', { screen: 'buy' })
  })
  it('should go back to sell for sell offers when pressing back close button', () => {
    useRouteMock.mockReturnValueOnce({ params: { isSellOffer: true, shouldGoBack: false } })
    const { getByText } = render(<OfferPublished />)
    const closeButton = getByText('close')
    fireEvent.press(closeButton)
    expect(replaceMock).toHaveBeenCalledWith('home', { screen: 'sell' })
  })
  it('should go back when pressing close', () => {
    useRouteMock.mockReturnValueOnce({ params: { isSellOffer: true, shouldGoBack: true } })
    const { getByText } = render(<OfferPublished />)
    const closeButton = getByText('close')
    fireEvent.press(closeButton)
    expect(goBackMock).toHaveBeenCalled()
  })
})
