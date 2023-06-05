import { renderHook } from '@testing-library/react-native'
import { NavigationWrapper, navigateMock } from '../../tests/unit/helpers/NavigationWrapper'
import { usePopupStore } from '../store/usePopupStore'
import { usePaymentTooLatePopup } from './usePaymentTooLatePopup'
import { PaymentTooLate } from './warning/PaymentTooLate'

describe('usePaymentTooLatePopup', () => {
  it('returns function to show help popup', () => {
    const { result } = renderHook(usePaymentTooLatePopup, { wrapper: NavigationWrapper })
    expect(result.current).toBeInstanceOf(Function)
  })
  it('opens popup with help text', () => {
    const { result } = renderHook(usePaymentTooLatePopup, { wrapper: NavigationWrapper })
    result.current()
    expect(usePopupStore.getState()).toEqual({
      ...usePopupStore.getState(),
      action2: {
        callback: expect.any(Function),
        label: 'help',
        icon: 'info',
      },
      content: <PaymentTooLate />,
      level: 'WARN',
      title: 'too late!',
      visible: true,
    })
  })
  it('should navigate to contact', () => {
    const { result } = renderHook(usePaymentTooLatePopup, { wrapper: NavigationWrapper })
    result.current()
    usePopupStore.getState().action2?.callback()
    expect(navigateMock).toHaveBeenCalledWith('contact')
    expect(usePopupStore.getState().visible).toEqual(false)
  })
})
