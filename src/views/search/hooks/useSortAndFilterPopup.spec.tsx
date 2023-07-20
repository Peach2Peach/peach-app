import { useSortAndFilterPopup } from './useSortAndFilterPopup'
import { render, renderHook, fireEvent, waitFor, act } from '@testing-library/react-native'
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
    expect(usePopupStore.getState()).toStrictEqual(
      expect.objectContaining({
        level: 'APP',
        action2: {
          label: 'close',
          icon: 'xSquare',
          callback: expect.any(Function),
        },
        action1: {
          label: 'apply',
          icon: 'checkSquare',
          callback: expect.any(Function),
        },
      }),
    )
    expect(render(usePopupStore.getState().content || <></>)).toMatchSnapshot()
  })
  it('should update the popup store with the correct content for sell offers', async () => {
    getOfferDetailsMock.mockResolvedValueOnce([sellOffer, null])
    const { result } = renderHook(() => useSortAndFilterPopup(sellOffer.id), { wrapper })
    await waitForQuery()
    const showPopup = result.current
    act(() => {
      showPopup()
    })
    expect(usePopupStore.getState()).toStrictEqual(
      expect.objectContaining({
        level: 'APP',
        action2: {
          label: 'close',
          icon: 'xSquare',
          callback: expect.any(Function),
        },
        action1: {
          label: 'apply',
          icon: 'checkSquare',
          callback: expect.any(Function),
        },
      }),
    )
    expect(render(usePopupStore.getState().content || <></>)).toMatchSnapshot()
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
  it('should patch the offer with the correct values when the apply button is pressed', async () => {
    const { result } = renderHook(() => useSortAndFilterPopup(buyOffer.id), { wrapper })
    await waitForQuery()
    const showPopup = result.current
    act(() => {
      showPopup()
    })
    const { getByText, getByPlaceholderText } = render(usePopupStore.getState().content || <></>)
    const checkbox = getByText('max premium')
    const input = getByPlaceholderText('20.00')
    act(() => {
      fireEvent.changeText(input, '20,23')
    })
    act(() => {
      fireEvent.press(checkbox)
    })

    await act(async () => {
      usePopupStore.getState().action1?.callback()
      await waitForQuery()
    })

    expect(patchOfferMock).toHaveBeenCalledWith({ offerId: buyOffer.id, maxPremium: 20.23 })
  })
  it('should not use the text input when the checkbox is not checked', async () => {
    const { result } = renderHook(() => useSortAndFilterPopup(buyOffer.id), { wrapper })
    await waitForQuery()
    const showPopup = result.current
    act(() => {
      showPopup()
    })
    const { getByPlaceholderText } = render(usePopupStore.getState().content || <></>)
    const input = getByPlaceholderText('20.00')
    act(() => {
      fireEvent.changeText(input, '20,23')
    })
    await act(async () => {
      usePopupStore.getState().action1?.callback()
      await waitForQuery()
    })

    expect(patchOfferMock).toHaveBeenCalledWith({ offerId: buyOffer.id, maxPremium: null })
  })
  it('should set the max premium to null when the input is an empty string', async () => {
    const { result } = renderHook(() => useSortAndFilterPopup(buyOffer.id), { wrapper })
    await waitForQuery()
    const showPopup = result.current
    act(() => {
      showPopup()
    })
    const { getByText, getByPlaceholderText } = render(usePopupStore.getState().content || <></>)
    const checkbox = getByText('max premium')
    const input = getByPlaceholderText('20.00')
    act(() => {
      fireEvent.changeText(input, '')
    })
    act(() => {
      fireEvent.press(checkbox)
    })

    await act(async () => {
      usePopupStore.getState().action1?.callback()
      await waitForQuery()
    })

    expect(patchOfferMock).toHaveBeenCalledWith({ offerId: buyOffer.id, maxPremium: null })
  })
  it('should not set the input to undefined when the input is an empty string', async () => {
    const { result } = renderHook(() => useSortAndFilterPopup(buyOffer.id), { wrapper })
    await waitForQuery()
    const showPopup = result.current
    act(() => {
      showPopup()
    })
    const { getByPlaceholderText } = render(usePopupStore.getState().content || <></>)
    const input = getByPlaceholderText('20.00')
    act(() => {
      fireEvent.changeText(input, '')
    })

    expect(input.props.value).toBe('')
  })
  it('should not use the text input when the checkbox was unchecked', async () => {
    const { result } = renderHook(() => useSortAndFilterPopup(buyOffer.id), { wrapper })
    await waitForQuery()
    const showPopup = result.current
    act(() => {
      showPopup()
    })
    const { getByText, getByPlaceholderText } = render(usePopupStore.getState().content || <></>)
    const checkbox = getByText('max premium')
    const input = getByPlaceholderText('20.00')
    act(() => {
      fireEvent.changeText(input, '20,23')
    })
    act(() => {
      fireEvent.press(checkbox)
    })
    act(() => {
      fireEvent.press(checkbox)
    })

    await act(async () => {
      usePopupStore.getState().action1?.callback()
      await waitForQuery()
    })

    expect(patchOfferMock).toHaveBeenCalledWith({ offerId: buyOffer.id, maxPremium: null })
  })
  it('should update the premium after the checkbox is checked', async () => {
    const { result } = renderHook(() => useSortAndFilterPopup(buyOffer.id), { wrapper })
    await waitForQuery()
    const showPopup = result.current
    act(() => {
      showPopup()
    })
    const { getByText, getByPlaceholderText } = render(usePopupStore.getState().content || <></>)
    const checkbox = getByText('max premium')
    const input = getByPlaceholderText('20.00')
    act(() => {
      fireEvent.changeText(input, '20,23')
    })
    act(() => {
      fireEvent.press(checkbox)
    })
    act(() => {
      fireEvent.changeText(input, '20,24')
    })

    await act(async () => {
      usePopupStore.getState().action1?.callback()
      await waitForQuery()
    })

    expect(patchOfferMock).toHaveBeenCalledWith({ offerId: buyOffer.id, maxPremium: 20.24 })
  })

  it.todo('should update the sorting when the apply button is pressed')
})

describe('BuySortAndFilter', () => {
  beforeEach(() => {
    queryClient.clear()
    usePopupStore.setState(defaultPopupState)
  })

  it('should not toggle the checkbox when no max premium is set', async () => {
    const { result } = renderHook(() => useSortAndFilterPopup(buyOffer.id), { wrapper })
    await waitForQuery()
    const showPopup = result.current
    act(() => {
      showPopup()
    })

    const { getByText } = render(usePopupStore.getState().content || <></>)
    const checkbox = getByText('max premium')
    act(() => {
      fireEvent.press(checkbox)
    })
    expect(render(usePopupStore.getState().content || <></>)).toMatchSnapshot()
  })

  it('should toggle the checkbox when the checkbox is pressed', async () => {
    const { result } = renderHook(() => useSortAndFilterPopup(buyOffer.id), { wrapper })
    await waitForQuery()
    const showPopup = result.current
    act(() => {
      showPopup()
    })

    const { getByText, getByPlaceholderText } = render(usePopupStore.getState().content || <></>)
    const checkbox = getByText('max premium')
    const input = getByPlaceholderText('20.00')
    act(() => {
      fireEvent.changeText(input, '20')
    })
    act(() => {
      fireEvent.press(checkbox)
    })
    expect(render(usePopupStore.getState().content || <></>)).toMatchSnapshot()
  })

  it.todo('should use the offer max premium as the default value for the input and checkbox')
})

async function waitForQuery () {
  await waitFor(() => {
    act(() => {
      expect(queryClient.isFetching()).toBe(0)
    })
  })
}
