/* eslint-disable max-lines */
import { useSortAndFilterPopup } from './useSortAndFilterPopup'
import { render, renderHook, waitFor, act } from '@testing-library/react-native'
import { queryClient } from '../../../../tests/unit/helpers/QueryClientWrapper'
import { buyOffer, sellOffer } from '../../../../tests/unit/data/offerData'
import { defaultPopupState, usePopupStore } from '../../../store/usePopupStore'
import { NavigationAndQueryClientWrapper } from '../../../../tests/unit/helpers/NavigationAndQueryClientWrapper'
import { getOfferDetails } from '../../../utils/peachAPI'

jest.useFakeTimers()

type GetOfferDetailsParams = Parameters<typeof getOfferDetails>[0]
const getOfferDetailsMock = jest.fn(({ offerId }: GetOfferDetailsParams) => {
  if (offerId === buyOffer.id) return Promise.resolve([buyOffer, null])
  if (offerId === sellOffer.id) return Promise.resolve([sellOffer, null])
  return Promise.resolve([null, null])
})
const patchOfferMock = jest.fn().mockResolvedValue([{ success: true }, null])
jest.mock('../../../utils/peachAPI', () => ({
  getOfferDetails: (args: GetOfferDetailsParams) => getOfferDetailsMock(args),
  patchOffer: (...args: unknown[]) => patchOfferMock(...args),
}))

jest.mock('../../../popups/filtersAndSorting', () => ({
  BuyFilterAndSort: 'BuyFilterAndSort',
  SellSorters: 'SellSorters',
}))

const wrapper = NavigationAndQueryClientWrapper
describe('useSortAndFilterPopup', () => {
  beforeEach(() => {
    queryClient.clear()
    usePopupStore.setState(defaultPopupState)
  })

  it('should return a function', async () => {
    const { result } = renderHook(() => useSortAndFilterPopup(buyOffer.id), { wrapper })
    expect(result.current).toBeInstanceOf(Function)
    await waitForQuery()
  })
  it('should call getOfferDetails with the offerId', async () => {
    renderHook(() => useSortAndFilterPopup(buyOffer.id), { wrapper })

    await waitForQuery()
    expect(getOfferDetailsMock).toHaveBeenCalledWith({ offerId: buyOffer.id })
  })
  it('should update the popup store with the correct content for buy offers', async () => {
    const { result } = renderHook(() => useSortAndFilterPopup(buyOffer.id), { wrapper })
    await waitForQuery()
    const showPopup = result.current
    act(() => {
      showPopup()
    })

    expect(render(usePopupStore.getState().popupComponent || <></>, { wrapper })).toMatchSnapshot()
  })
  it('should update the popup store with the correct content for sell offers', async () => {
    getOfferDetailsMock.mockResolvedValueOnce([sellOffer, null])
    const { result } = renderHook(() => useSortAndFilterPopup(sellOffer.id), { wrapper })
    await waitForQuery()
    const showPopup = result.current
    act(() => {
      showPopup()
    })
    expect(render(usePopupStore.getState().popupComponent || <></>, { wrapper })).toMatchSnapshot()
  })
  it('should not update the popup store if the offer is not found', async () => {
    const { result } = renderHook(() => useSortAndFilterPopup('unknownOfferId'), { wrapper })
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
