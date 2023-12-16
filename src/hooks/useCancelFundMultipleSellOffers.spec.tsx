import { act, fireEvent, render, renderHook, responseUtils, waitFor } from 'test-utils'
import { Popup, PopupAction } from '../components/popup'
import { CancelOffer } from '../popups/CancelOffer'
import { GrayPopup } from '../popups/GrayPopup'
import { ClosePopupAction } from '../popups/actions'
import { LoadingPopupAction } from '../popups/actions/LoadingPopupAction'
import { usePopupStore } from '../store/usePopupStore'
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

    expect(usePopupStore.getState().visible).toEqual(true)
    expect(usePopupStore.getState().popupComponent).toStrictEqual(
      <GrayPopup
        title="cancel offer"
        content={<CancelOffer type="ask" />}
        actions={
          <>
            <PopupAction label="never mind" iconId="arrowLeftCircle" onPress={expect.any(Function)} />
            <LoadingPopupAction label="cancel offer" iconId="xCircle" onPress={expect.any(Function)} reverseOrder />
          </>
        }
      />,
    )
  })

  it('should show cancel offer confirmation popup', async () => {
    const { result } = renderHook(useCancelFundMultipleSellOffers, {
      initialProps: { fundMultiple },
    })
    result.current()

    const popupComponent = usePopupStore.getState().popupComponent || <></>
    const { getAllByText } = render(popupComponent)
    fireEvent.press(getAllByText('cancel offer')[1])

    await waitFor(() => {
      expect(usePopupStore.getState().visible).toEqual(true)
      expect(usePopupStore.getState().popupComponent).toStrictEqual(
        <GrayPopup title="offer canceled!" actions={<ClosePopupAction style={{ justifyContent: 'center' }} />} />,
      )
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

    const popupComponent = usePopupStore.getState().popupComponent || <></>
    const { getAllByText } = render(popupComponent)
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

    const { getAllByText } = render(<Popup />)
    fireEvent.press(getAllByText('cancel offer')[1])

    await waitFor(() => {
      expect(usePopupStore.getState().visible).toEqual(true)
      expect(usePopupStore.getState().popupComponent).toStrictEqual(
        <GrayPopup title="offer canceled!" actions={<ClosePopupAction style={{ justifyContent: 'center' }} />} />,
      )
    })
    expect(useWalletState.getState().fundMultipleMap).toEqual({ [fundMultiple.address]: ['1', '2'] })
  })
})
