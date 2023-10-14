import { act, fireEvent, render, renderHook, waitFor } from 'test-utils'
import { unauthorizedError } from '../../tests/unit/data/peachAPIData'
import { NavigationAndQueryClientWrapper } from '../../tests/unit/helpers/CustomWrapper'
import { usePopupStore } from '../store/usePopupStore'
import { useWalletState } from '../utils/wallet/walletStore'
import { useCancelFundMultipleSellOffers } from './useCancelFundMultipleSellOffers'

const saveOfferMock = jest.fn()
jest.mock('../utils/offer/saveOffer', () => ({
  saveOffer: (...args: unknown[]) => saveOfferMock(...args),
}))

const cancelOfferMock = jest.fn().mockResolvedValue([{}, null])
jest.mock('../utils/peachAPI', () => ({
  cancelOffer: (...args: unknown[]) => cancelOfferMock(...args),
}))

const wrapper = NavigationAndQueryClientWrapper

describe('useCancelFundMultipleSellOffers', () => {
  const fundMultiple = {
    address: 'address1',
    offerIds: ['1', '2', '3'],
  }
  beforeEach(() => {
    useWalletState.getState().registerFundMultiple(fundMultiple.address, fundMultiple.offerIds)
  })
  it('should show cancel offer popup', () => {
    const { result } = renderHook(useCancelFundMultipleSellOffers, {
      wrapper,
      initialProps: { fundMultiple },
    })
    result.current()

    const popupComponent = usePopupStore.getState().content || <></>
    const { toJSON } = render(popupComponent, { wrapper })
    expect(toJSON()).toMatchSnapshot()
  })

  it('should show cancel offer confirmation popup', async () => {
    const { result } = renderHook(useCancelFundMultipleSellOffers, {
      wrapper,
      initialProps: { fundMultiple },
    })
    result.current()

    const popupComponent = usePopupStore.getState().popupComponent || <></>
    const { getAllByText } = render(popupComponent, { wrapper })
    fireEvent.press(getAllByText('cancel offer')[1])

    await waitFor(() => {
      expect(usePopupStore.getState()).toEqual({
        ...usePopupStore.getState(),
        title: 'offer canceled!',
        level: 'DEFAULT',
      })
    })

    expect(cancelOfferMock).toHaveBeenCalledWith({ offerId: fundMultiple.offerIds[0] })
    expect(cancelOfferMock).toHaveBeenCalledWith({ offerId: fundMultiple.offerIds[1] })
    expect(cancelOfferMock).toHaveBeenCalledWith({ offerId: fundMultiple.offerIds[2] })
    expect(useWalletState.getState().fundMultipleMap).toEqual({})
  })
  it('not not cancel if no fundMultiple has been passed', async () => {
    const { result } = renderHook(useCancelFundMultipleSellOffers, {
      wrapper,
      initialProps: { fundMultiple: undefined },
    })
    result.current()

    const popupComponent = usePopupStore.getState().popupComponent || <></>
    const { getAllByText } = render(popupComponent, { wrapper })
    await act(async () => {
      await fireEvent.press(getAllByText('cancel offer')[1])
    })

    expect(cancelOfferMock).not.toHaveBeenCalled()
  })
  it('should handle cancelation errors', async () => {
    cancelOfferMock.mockResolvedValueOnce([null, unauthorizedError])
    cancelOfferMock.mockResolvedValueOnce([null, null])

    const { result } = renderHook(useCancelFundMultipleSellOffers, {
      wrapper,
      initialProps: { fundMultiple },
    })
    result.current()

    const popupComponent = usePopupStore.getState().popupComponent || <></>
    const { getAllByText } = render(popupComponent, { wrapper })
    fireEvent.press(getAllByText('cancel offer')[1])

    await waitFor(() => {
      expect(usePopupStore.getState()).toEqual({
        ...usePopupStore.getState(),
        title: 'offer canceled!',
        level: 'DEFAULT',
      })
    })
    expect(useWalletState.getState().fundMultipleMap).toEqual({ [fundMultiple.address]: ['1', '2'] })
  })
})
