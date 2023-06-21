import { act, renderHook } from '@testing-library/react-native'
import { NavigationWrapper, navigateMock } from '../../tests/unit/helpers/NavigationWrapper'
import { defaultPopupState, usePopupStore } from '../store/usePopupStore'
import { BuyOfferExpired } from './BuyOfferExpired'
import { useBuyOfferExpiredPopup } from './useBuyOfferExpiredPopup'

const wrapper = NavigationWrapper

describe('useBuyOfferExpiredPopup', () => {
  const offerId = '37'
  const days = '30'
  afterEach(() => {
    usePopupStore.setState(defaultPopupState)
    jest.resetAllMocks()
  })

  it('opens BuyOfferExpired popup', () => {
    const { result } = renderHook(useBuyOfferExpiredPopup, { wrapper })
    act(() => {
      result.current(offerId, days)
    })

    expect(usePopupStore.getState()).toEqual({
      ...usePopupStore.getState(),
      title: 'Buy offer removed',
      content: <BuyOfferExpired {...{ offerId, days }} />,
      visible: true,
      level: 'APP',
      action1: {
        label: 'close',
        icon: 'xSquare',
        callback: expect.any(Function),
      },
      action2: {
        label: 'help',
        icon: 'helpCircle',
        callback: expect.any(Function),
      },
    })
  })
  it('closes popup', () => {
    const { result } = renderHook(useBuyOfferExpiredPopup, { wrapper })
    act(() => {
      result.current(offerId, days)
    })

    usePopupStore.getState().action1?.callback()

    expect(usePopupStore.getState().visible).toBeFalsy()
  })
  it('navigates to contact', () => {
    const { result } = renderHook(useBuyOfferExpiredPopup, { wrapper })
    act(() => {
      result.current(offerId, days)
    })
    usePopupStore.getState().action2?.callback()

    expect(usePopupStore.getState().visible).toBeFalsy()
    expect(navigateMock).toHaveBeenCalledWith('contact')
  })
})
