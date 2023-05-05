import { renderHook } from '@testing-library/react-native'
import { useShowDisputeDisclaimer } from './useShowDisputeDisclaimer'
import { act } from 'react-test-renderer'
import { OverlayContext, defaultOverlay } from '../../../contexts/overlay'
import { DisputeDisclaimer } from '../../../overlays/info/DisputeDisclaimer'
import { configStore } from '../../../store/configStore'

const navigateMock = jest.fn()
jest.mock('../../../hooks/useNavigation', () => ({
  useNavigation: () => ({
    navigate: navigateMock,
  }),
}))

describe('useShowDisputeDisclaimer', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })
  let overlayState = { ...defaultOverlay }
  const updateOverlay = jest.fn((newState) => (overlayState = newState))

  const { result } = renderHook(useShowDisputeDisclaimer, {
    wrapper: ({ children }) => (
      <OverlayContext.Provider value={[overlayState, updateOverlay]}>{children}</OverlayContext.Provider>
    ),
  })
  afterEach(() => {
    jest.clearAllMocks()
    overlayState = { ...defaultOverlay }
  })
  it('should show the overlay', () => {
    const showDisputeDisclaimer = result.current
    act(() => showDisputeDisclaimer())
    expect(overlayState).toStrictEqual({
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
  it('should hide the overlay, store that popup has been seen and navigate to contact screen', () => {
    const showDisputeDisclaimer = result.current
    act(() => {
      showDisputeDisclaimer()
      overlayState.action2?.callback()
    })
    expect(overlayState).toStrictEqual({ visible: false })
    expect(navigateMock).toHaveBeenCalledWith('contact')
    expect(configStore.getState().seenDisputeDisclaimer).toBeTruthy()
  })
  it('should hide the overlay, store that popup has been seen on close', () => {
    const showDisputeDisclaimer = result.current
    act(() => {
      showDisputeDisclaimer()
      overlayState.action1?.callback()
    })
    expect(overlayState).toStrictEqual({ visible: false })
    expect(navigateMock).not.toHaveBeenCalled()
    expect(configStore.getState().seenDisputeDisclaimer).toBeTruthy()
  })
})
