import { Overlay } from './Overlay'
import { createRenderer } from 'react-test-renderer/shallow'
import { act, fireEvent, render } from '@testing-library/react-native'
import { Text, BackHandler } from 'react-native'
import { defaultOverlay, OverlayContext } from '../contexts/overlay'

jest.mock('react-native/Libraries/Utilities/BackHandler', () =>
  jest.requireActual('react-native/Libraries/Utilities/__mocks__/BackHandler.js'),
)

describe('Overlay', () => {
  let overlayState = { ...defaultOverlay, visible: true }
  const updateOverlay = jest.fn((newOverlayState: Partial<OverlayState>) => {
    overlayState = {
      ...overlayState,
      ...newOverlayState,
    }
  })
  const wrapper = ({ children }: { children: JSX.Element }) => (
    <OverlayContext.Provider value={[defaultOverlay, updateOverlay]}>{children}</OverlayContext.Provider>
  )
  const renderer = createRenderer()

  beforeEach(() => {
    overlayState = { ...defaultOverlay, visible: true }
    jest.clearAllMocks()
  })
  it('should render correctly', () => {
    renderer.render(<Overlay {...overlayState} level={undefined} />)
    const result = renderer.getRenderOutput()
    expect(result).toMatchSnapshot()
  })
  it('should render correctly with existing, disabled actions and "WARN" level', () => {
    renderer.render(
      <Overlay
        {...overlayState}
        level="WARN"
        action1={{ label: 'action1', disabled: true, icon: 'testIcon', callback: jest.fn() }}
        action2={{ label: 'action2', disabled: true, callback: jest.fn() }}
      />,
    )
    const result = renderer.getRenderOutput()
    expect(result).toMatchSnapshot()
  })
  it('should call action1 callback when action1 is pressed', () => {
    const action1Callback = jest.fn()
    const { getByText } = render(
      <Overlay
        {...overlayState}
        action1={{ label: 'action1', callback: action1Callback }}
        action2={{ label: 'action2', callback: jest.fn() }}
      />,
      { wrapper },
    )
    fireEvent.press(getByText('action1'))
    expect(action1Callback).toHaveBeenCalled()
  })
  it('should not call action1 callback when action1 is pressed and action1 is disabled', () => {
    const action1Callback = jest.fn()
    const { getByText } = render(
      <Overlay
        {...overlayState}
        action1={{ label: 'action1', disabled: true, callback: action1Callback }}
        action2={{ label: 'action2', callback: jest.fn() }}
      />,
      { wrapper },
    )
    fireEvent.press(getByText('action1'))
    expect(action1Callback).not.toHaveBeenCalled()
  })
  it('should close the overlay when the hardware back button is pressed', () => {
    render(<Overlay {...overlayState} content={<Text>TestContent</Text>} />, { wrapper })

    act(() => {
      // @ts-ignore
      BackHandler.mockPressBack()
    })
    expect(overlayState.visible).toBe(false)
  })
  it('should not close the overlay when the hardware back button is pressed and there is no content', () => {
    render(<Overlay {...overlayState} />, { wrapper })

    act(() => {
      // @ts-ignore
      BackHandler.mockPressBack()
    })
    expect(overlayState.visible).toBe(true)
  })
  it('should close the overlay when the background is pressed', () => {
    const { getByTestId } = render(<Overlay {...overlayState} />, { wrapper })

    act(() => {
      fireEvent.press(getByTestId('overlay-background'))
    })
    expect(overlayState.visible).toBe(false)
  })
  it('should not close the overlay when the background is pressed and requireUserAction is true', () => {
    const { getByTestId } = render(<Overlay {...overlayState} requireUserAction={true} />, { wrapper })

    act(() => {
      fireEvent.press(getByTestId('overlay-background'))
    })
    expect(overlayState.visible).toBe(true)
  })
})
