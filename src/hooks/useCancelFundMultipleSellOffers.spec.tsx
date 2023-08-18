import { renderHook, waitFor } from '@testing-library/react-native'
import { unauthorizedError } from '../../tests/unit/data/peachAPIData'
import { NavigationAndQueryClientWrapper } from '../../tests/unit/helpers/NavigationAndQueryClientWrapper'
import { CancelOffer } from '../popups/CancelOffer'
import { usePopupStore } from '../store/usePopupStore'
import { useWalletState } from '../utils/wallet/walletStore'
import { useCancelFundMultipleSellOffers } from './useCancelFundMultipleSellOffers'

const saveOfferMock = jest.fn()
jest.mock('../utils/offer/saveOffer', () => ({
  saveOffer: (...args: any[]) => saveOfferMock(...args),
}))

const cancelOfferMock = jest.fn().mockResolvedValue([{}, null])
jest.mock('../utils/peachAPI', () => ({
  cancelOffer: (...args: any[]) => cancelOfferMock(...args),
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

    expect(usePopupStore.getState()).toEqual({
      ...usePopupStore.getState(),
      action1: {
        callback: expect.any(Function),
        icon: 'xCircle',
        label: 'cancel offer',
      },
      action2: {
        callback: usePopupStore.getState().closePopup,
        icon: 'arrowLeftCircle',
        label: 'never mind',
      },
      content: <CancelOffer type="ask" />,
      level: 'DEFAULT',
      title: 'cancel offer',
      visible: true,
    })
  })

  it('should show cancel offer confirmation popup', async () => {
    const { result } = renderHook(useCancelFundMultipleSellOffers, {
      wrapper,
      initialProps: { fundMultiple },
    })
    result.current()

    usePopupStore.getState().action1?.callback()
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
  it('not not cancel if no fundMultiple has been passed', () => {
    const { result } = renderHook(useCancelFundMultipleSellOffers, {
      wrapper,
      initialProps: { fundMultiple: undefined },
    })
    result.current()

    usePopupStore.getState().action1?.callback()

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

    usePopupStore.getState().action1?.callback()

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
