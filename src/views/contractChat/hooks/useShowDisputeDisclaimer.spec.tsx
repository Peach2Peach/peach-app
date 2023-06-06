import { renderHook } from '@testing-library/react-native'
import { act } from 'react-test-renderer'
import { NavigationWrapper, navigateMock } from '../../../../tests/unit/helpers/NavigationWrapper'
import { DisputeDisclaimer } from '../../../popups/info/DisputeDisclaimer'
import { configStore } from '../../../store/configStore'
import { usePopupStore } from '../../../store/usePopupStore'
import { useShowDisputeDisclaimer } from './useShowDisputeDisclaimer'

describe('useShowDisputeDisclaimer', () => {
  const wrapper = NavigationWrapper
  const { result } = renderHook(useShowDisputeDisclaimer, { wrapper })

  afterEach(() => {
    jest.clearAllMocks()
  })
  it('should show the popup', () => {
    const showDisputeDisclaimer = result.current
    act(() => {
      showDisputeDisclaimer()
    })
    expect(usePopupStore.getState()).toEqual({
      ...usePopupStore.getState(),
      title: 'trade chat',
      content: <DisputeDisclaimer />,
      visible: true,
      level: 'INFO',
      action1: {
        label: 'close',
        icon: 'xSquare',
        callback: expect.any(Function),
      },
      action2: {
        label: 'help',
        icon: 'info',
        callback: expect.any(Function),
      },
    })
  })
  it('should hide the popup, store that popup has been seen and navigate to contact screen', () => {
    const showDisputeDisclaimer = result.current
    act(() => {
      showDisputeDisclaimer()
      usePopupStore.getState().action2?.callback()
    })
    expect(usePopupStore.getState().visible).toEqual(false)
    expect(navigateMock).toHaveBeenCalledWith('contact')
    expect(configStore.getState().seenDisputeDisclaimer).toBeTruthy()
  })
  it('should hide the popup, store that popup has been seen on close', () => {
    const showDisputeDisclaimer = result.current
    act(() => {
      showDisputeDisclaimer()
      usePopupStore.getState().action1?.callback()
    })
    expect(usePopupStore.getState().visible).toEqual(false)
    expect(navigateMock).not.toHaveBeenCalled()
    expect(configStore.getState().seenDisputeDisclaimer).toBeTruthy()
  })
})
