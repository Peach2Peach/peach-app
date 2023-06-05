import { renderHook } from '@testing-library/react-native'
import { NavigationWrapper, navigateMock } from '../../tests/unit/helpers/NavigationWrapper'
import { AcceptMatchPopup } from '../overlays/info/AcceptMatchPopup'
import { usePopupStore } from '../store/usePopupStore'
import { useShowHelp } from './useShowHelp'

describe('useShowHelp', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })
  it('returns function to show help popup', () => {
    const { result } = renderHook(useShowHelp, { wrapper: NavigationWrapper, initialProps: 'acceptMatch' })
    expect(result.current).toBeInstanceOf(Function)
  })
  it('opens overlay with help text', () => {
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
  it('should navigate to contact', () => {
    const { result } = renderHook(useShowHelp, { wrapper: NavigationWrapper, initialProps: 'acceptMatch' })
    result.current()
    usePopupStore.getState().action2?.callback()
    expect(navigateMock).toHaveBeenCalledWith('contact')
    expect(usePopupStore.getState().visible).toEqual(false)
  })
})
