import { act, fireEvent, render, responseUtils, waitFor } from 'test-utils'
import { buyOffer } from '../../tests/unit/data/offerData'
import { Popup } from '../components/popup/Popup'
import { peachAPI } from '../utils/peachAPI'
import { CancelOfferPopup } from './CancelOfferPopup'

jest.mock('../utils/offer/saveOffer')
jest.useFakeTimers()
jest.spyOn(peachAPI.private.offer, 'getOfferDetails').mockResolvedValue({ result: buyOffer, ...responseUtils })

describe('CancelOfferPopup', () => {
  it('should show cancel offer confirmation popup', async () => {
    const { getAllByText } = render(<CancelOfferPopup offerId={buyOffer.id} />)
    await act(async () => {
      await jest.runAllTimersAsync()
    })
    fireEvent.press(getAllByText('cancel offer')[1])

    const { queryByText } = render(<Popup />)

    await waitFor(() => {
      expect(queryByText('offer canceled!')).toBeTruthy()
    })
  })
})
