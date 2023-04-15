import { Drawer } from './Drawer'
import { act, fireEvent, render, waitFor } from '@testing-library/react-native'
import { BackHandler, Text } from 'react-native'
import { createRenderer } from 'react-test-renderer/shallow'
import { DrawerContext } from '../contexts/drawer'

const defaultState: DrawerState = {
  title: 'testTitle',
  content: <Text>Drawer content</Text>,
  show: true,
  previousDrawer: {},
  onClose: () => {},
}

jest.mock('react-native/Libraries/Utilities/BackHandler', () =>
  jest.requireActual('react-native/Libraries/Utilities/__mocks__/BackHandler.js'),
)

describe('Drawer', () => {
  const shallowRenderer = createRenderer()
  let drawerState = { ...defaultState }
  const updateDrawer = jest.fn((newDrawerState: Partial<DrawerState>) => {
    drawerState = {
      ...drawerState,
      ...newDrawerState,
    }
  })
  const wrapper = ({ children }: { children: JSX.Element }) => (
    // @ts-ignore  this is because the drawerState has show as false
    <DrawerContext.Provider value={[drawerState, updateDrawer]}>{children}</DrawerContext.Provider>
  )

  beforeEach(() => {
    drawerState = { ...defaultState }
  })
  it('renders correctly', () => {
    shallowRenderer.render(<Drawer {...drawerState} />, { wrapper })
    const result = shallowRenderer.getRenderOutput()
    expect(result).toMatchSnapshot()
  })
  it('renders correctly with previous drawer', () => {
    drawerState = {
      ...drawerState,
      previousDrawer: {
        title: 'previousDrawerTitle',
      },
    }
    shallowRenderer.render(<Drawer {...drawerState} />, { wrapper })
    const result = shallowRenderer.getRenderOutput()
    expect(result).toMatchSnapshot()
  })
  it('should call onClose when the drawer is closed', () => {
    const onClose = jest.fn()
    drawerState = {
      ...drawerState,
      show: false,
      onClose,
    }
    render(<Drawer {...drawerState} />, { wrapper })
    expect(onClose).toHaveBeenCalledTimes(1)
  })
  it('should close the drawer when the close button is pressed', () => {
    const { getByTestId } = render(<Drawer {...drawerState} />, { wrapper })
    const closeButton = getByTestId('closeButton')
    act(() => {
      fireEvent.press(closeButton)
    })
    expect(drawerState.show).toBe(false)
  })
  it('should close the drawer on hardware back press', () => {
    render(<Drawer {...drawerState} />, { wrapper })

    act(() => {
      // @ts-ignore
      BackHandler.mockPressBack()
    })
    expect(drawerState.show).toBe(false)
  })
  it('should not close the drawer on hardware back press if there is no content', () => {
    drawerState = {
      ...drawerState,
      // @ts-expect-error
      content: null,
    }
    render(<Drawer {...drawerState} />, { wrapper })

    act(() => {
      // @ts-ignore
      BackHandler.mockPressBack()
    })
    expect(drawerState.show).toBe(true)
  })
  it('should close the drawer if the fade value is 0', async () => {
    drawerState = {
      ...drawerState,
      show: false,
    }
    render(<Drawer {...drawerState} />, { wrapper })

    await waitFor(() => {
      expect(drawerState.show).toBe(false)
      expect(drawerState.content).toBe(false)
      expect(drawerState.onClose).toBeInstanceOf(Function)
    })
  })
  it('should replace the onClose function if the fade value is 0', async () => {
    drawerState = {
      ...drawerState,
      show: false,
      onClose: jest.fn().mockReturnValue(true),
    }
    render(<Drawer {...drawerState} />, { wrapper })

    await waitFor(() => {
      expect(drawerState.show).toBe(false)
      expect(drawerState.content).toBe(false)
      expect(drawerState.onClose).toBeInstanceOf(Function)
    })
    expect(drawerState.onClose()).toBeUndefined()
  })
  it('should go back if the back button is pressed', () => {
    drawerState = {
      ...drawerState,
      previousDrawer: {
        title: 'previousDrawerTitle',
        content: <Text>Previous drawer content</Text>,
      },
    }
    const { getByTestId } = render(<Drawer {...drawerState} />, { wrapper })
    const backButton = getByTestId('backButton')
    act(() => {
      fireEvent.press(backButton)
    })
    expect(drawerState.title).toBe(drawerState.previousDrawer.title)
    expect(drawerState.content).toBe(drawerState.previousDrawer.content)
  })
  it('should close the drawer if the title is swiped down', async () => {
    const { getByText } = render(<Drawer {...drawerState} />, { wrapper })
    const title = getByText(drawerState.title)
    act(() => {
      fireEvent(title, 'onTouchStart', { nativeEvent: { pageY: 0 } })
      fireEvent(title, 'onTouchMove', { nativeEvent: { pageY: 100 } })
    })

    expect(drawerState.show).toBe(false)
  })
  it('should not close the drawer if the title is swiped down less than 21 pixels', async () => {
    const { getByText } = render(<Drawer {...drawerState} />, { wrapper })
    const title = getByText(drawerState.title)
    act(() => {
      fireEvent(title, 'onTouchStart', { nativeEvent: { pageY: 0 } })
      fireEvent(title, 'onTouchMove', { nativeEvent: { pageY: 20 } })
    })

    expect(drawerState.show).toBe(true)
  })
})
