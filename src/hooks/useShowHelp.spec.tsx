import { renderHook } from '@testing-library/react-native'
import { NavigationWrapper, navigateMock } from '../../tests/unit/helpers/NavigationWrapper'
import { AcceptMatchPopup } from '../popups/info/AcceptMatchPopup'
import { AddressSigning } from '../popups/info/AddressSigning'
import { usePopupStore } from '../store/usePopupStore'
import { useShowHelp } from './useShowHelp'

describe('useShowHelp', () => {
  it('returns function to show help popup', () => {
    const { result } = renderHook(useShowHelp, { wrapper: NavigationWrapper, initialProps: 'acceptMatch' })
    expect(result.current).toBeInstanceOf(Function)
  })
  it('opens popup with help text', () => {
    const { result } = renderHook(useShowHelp, { wrapper: NavigationWrapper, initialProps: 'acceptMatch' })
    result.current()
    expect(usePopupStore.getState()).toEqual({
      ...usePopupStore.getState(),
      action2: {
        callback: expect.any(Function),
        label: 'help',
        icon: 'info',
      },
      content: <AcceptMatchPopup />,
      level: 'INFO',
      title: 'accept match = start trade',
      visible: true,
    })
  })
  it('opens popup with different help text (overwrite)', () => {
    const { result } = renderHook(useShowHelp, { wrapper: NavigationWrapper, initialProps: 'acceptMatch' })
    result.current('addressSigning')
    expect(usePopupStore.getState()).toEqual({
      ...usePopupStore.getState(),
      action2: {
        callback: expect.any(Function),
        label: 'help',
        icon: 'info',
      },
      content: <AddressSigning />,
      level: 'INFO',
      title: 'accept match = start trade',
      visible: true,
    })
  })
  it('should navigate to contact', () => {
    const { result } = renderHook(useShowHelp, { wrapper: NavigationWrapper, initialProps: 'acceptMatch' })
    result.current()
    usePopupStore.getState().action2?.callback()
    expect(navigateMock).toHaveBeenCalledWith('contact')
    expect(usePopupStore.getState().visible).toEqual(false)
  })
})
