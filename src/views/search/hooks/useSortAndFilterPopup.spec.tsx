import { act, render, renderHook, responseUtils, waitFor } from 'test-utils'
import { buyOffer, sellOffer } from '../../../../tests/unit/data/offerData'
import { queryClient } from '../../../../tests/unit/helpers/QueryClientWrapper'
import { defaultPopupState, usePopupStore } from '../../../store/usePopupStore'
import { peachAPI } from '../../../utils/peachAPI'
import { useSortAndFilterPopup } from './useSortAndFilterPopup'

jest.useFakeTimers()

const getOfferDetailsMock = jest.spyOn(peachAPI.private.offer, 'getOfferDetails').mockImplementation(({ offerId }) => {
  if (offerId === buyOffer.id) return Promise.resolve({ result: buyOffer, ...responseUtils })
  if (offerId === sellOffer.id) return Promise.resolve({ result: sellOffer, ...responseUtils })
  return Promise.resolve(responseUtils)
})

jest.mock('../../../popups/filtersAndSorting', () => ({
  BuyFilterAndSort: 'BuyFilterAndSort',
  SellSorters: 'SellSorters',
}))

describe('useSortAndFilterPopup', () => {
  beforeEach(() => {
    queryClient.clear()
    usePopupStore.setState(defaultPopupState)
  })

  it('should return a function', async () => {
    const { result } = renderHook(() => useSortAndFilterPopup(buyOffer.id))
    expect(result.current).toBeInstanceOf(Function)
    await waitForQuery()
  })
  it('should call getOfferDetails with the offerId', async () => {
    renderHook(() => useSortAndFilterPopup(buyOffer.id))

    await waitForQuery()
    expect(getOfferDetailsMock).toHaveBeenCalledWith({ offerId: buyOffer.id })
  })
  it('should update the popup store with the correct content for buy offers', async () => {
    const { result } = renderHook(() => useSortAndFilterPopup(buyOffer.id))
    await waitForQuery()
    const showPopup = result.current
    act(() => {
      showPopup()
    })

    expect(render(usePopupStore.getState().popupComponent || <></>)).toMatchSnapshot()
  })
  it('should update the popup store with the correct content for sell offers', async () => {
    const { result } = renderHook(() => useSortAndFilterPopup(sellOffer.id))
    await waitForQuery()
    const showPopup = result.current
    act(() => {
      showPopup()
    })
    expect(render(usePopupStore.getState().popupComponent || <></>)).toMatchSnapshot()
  })
  it('should not update the popup store if the offer is not found', async () => {
    const { result } = renderHook(() => useSortAndFilterPopup('unknownOfferId'))
    await waitForQuery()
    const showPopup = result.current
    act(() => {
      showPopup()
    })
    expect(usePopupStore.getState()).toStrictEqual(expect.objectContaining(defaultPopupState))
  })
})

async function waitForQuery () {
  await waitFor(() => {
    act(() => {
      expect(queryClient.isFetching()).toBe(0)
    })
  })
}
