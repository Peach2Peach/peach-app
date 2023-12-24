import { act, fireEvent, render, renderHook, responseUtils, waitFor } from 'test-utils'
import { Popup } from '../components/popup'
import i18n from '../utils/i18n'
import { peachAPI } from '../utils/peachAPI'
import { useWalletState } from '../utils/wallet/walletStore'
import { useCancelFundMultipleSellOffers } from './useCancelFundMultipleSellOffers'

const saveOfferMock = jest.fn()
jest.mock('../utils/offer/saveOffer', () => ({
  saveOffer: (...args: unknown[]) => saveOfferMock(...args),
}))

const cancelOfferMock = jest.spyOn(peachAPI.private.offer, 'cancelOffer')

describe('useCancelFundMultipleSellOffers', () => {
  const fundMultiple = {
    address: 'address1',
    offerIds: ['1', '2', '3'],
  }
  beforeEach(() => {
    useWalletState.getState().registerFundMultiple(fundMultiple.address, fundMultiple.offerIds)
  })
  it('should show cancel offer popup', () => {
    const { result } = renderHook(useCancelFundMultipleSellOffers, { initialProps: { fundMultiple } })
    result.current()

    const { queryByText } = render(<Popup />)
    expect(queryByText(i18n('offer.cancel.popup.description'))).not.toBeNull()
  })

  it('should show cancel offer confirmation popup', async () => {
    const { result } = renderHook(useCancelFundMultipleSellOffers, {
      initialProps: { fundMultiple },
    })
    result.current()

    const { getAllByText, queryByText } = render(<Popup />)
    fireEvent.press(getAllByText('cancel offer')[1])

    await waitFor(() => {
      expect(queryByText('offer canceled!')).toBeTruthy()
    })

    expect(cancelOfferMock).toHaveBeenCalledWith({ offerId: fundMultiple.offerIds[0] })
    expect(cancelOfferMock).toHaveBeenCalledWith({ offerId: fundMultiple.offerIds[1] })
    expect(cancelOfferMock).toHaveBeenCalledWith({ offerId: fundMultiple.offerIds[2] })
    expect(useWalletState.getState().fundMultipleMap).toEqual({})
  })
  it('not not cancel if no fundMultiple has been passed', async () => {
    const { result } = renderHook(useCancelFundMultipleSellOffers, {
      initialProps: { fundMultiple: undefined },
    })
    result.current()

    const { getAllByText } = render(<Popup />)
    await act(async () => {
      await fireEvent.press(getAllByText('cancel offer')[1])
    })

    expect(cancelOfferMock).not.toHaveBeenCalled()
  })
  it('should handle cancelation errors', async () => {
    cancelOfferMock.mockResolvedValueOnce({ error: { error: 'UNAUTHORIZED' }, ...responseUtils })
    cancelOfferMock.mockResolvedValueOnce(responseUtils)

    const { result } = renderHook(useCancelFundMultipleSellOffers, {
      initialProps: { fundMultiple },
    })
    result.current()

    const { getAllByText, queryByText } = render(<Popup />)
    fireEvent.press(getAllByText('cancel offer')[1])

    await waitFor(() => {
      expect(queryByText('offer canceled!')).not.toBeNull()
    })
    expect(useWalletState.getState().fundMultipleMap).toEqual({ [fundMultiple.address]: ['1', '2'] })
  })
})
