import { BackHandler, Text } from 'react-native'
import { createRenderer } from 'react-test-renderer/shallow'
import { act, render } from 'test-utils'
import { Drawer } from '.'
import { DrawerContext } from '../../contexts/drawer'

const onCloseMock = jest.fn()
const defaultState: DrawerState = {
  title: 'testTitle',
  content: <Text>Drawer content</Text>,
  options: [],
  show: true,
  previousDrawer: undefined,
  onClose: onCloseMock,
}

jest.mock('react-native/Libraries/Utilities/BackHandler', () =>
  jest.requireActual('react-native/Libraries/Utilities/__mocks__/BackHandler.js'),
)

jest.useFakeTimers()

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
    <DrawerContext.Provider value={[drawerState, updateDrawer]}>{children}</DrawerContext.Provider>
  )

  beforeEach(() => {
    updateDrawer(defaultState)
  })
  it('renders correctly', () => {
    shallowRenderer.render(<Drawer />, { wrapper })
    const result = shallowRenderer.getRenderOutput()
    expect(result).toMatchSnapshot()
  })
  it('renders correctly with options', () => {
    updateDrawer({
      ...defaultState,
      options: [
        {
          title: 'option1',
          onPress: jest.fn(),
        },
        {
          title: 'option2',
          onPress: jest.fn(),
        },
      ],
      content: null,
      show: true,
    })
    shallowRenderer.render(<Drawer />, { wrapper })
    const result = shallowRenderer.getRenderOutput()
    expect(result).toMatchSnapshot()
  })
  it('renders correctly with previous drawer', () => {
    updateDrawer({
      ...defaultState,
      previousDrawer: {
        ...defaultState,
        title: 'previousDrawerTitle',
      },
    })
    shallowRenderer.render(<Drawer />, { wrapper })
    const result = shallowRenderer.getRenderOutput()
    expect(result).toMatchSnapshot()
  })
  it('should close the drawer and call onClose on hardware back press', () => {
    render(<Drawer />, { wrapper })

    act(() => {
      // @ts-ignore
      BackHandler.mockPressBack()
      jest.runAllTimers()
    })
    expect(drawerState.show).toBe(false)
    expect(onCloseMock).toHaveBeenCalledTimes(1)
  })
  it('should show the previous drawer on hardware back press if it exists', () => {
    updateDrawer({
      ...defaultState,
      previousDrawer: {
        ...defaultState,
        title: 'previousDrawerTitle',
      },
    })
    render(<Drawer />, { wrapper })

    act(() => {
      // @ts-ignore
      BackHandler.mockPressBack()
      jest.runAllTimers()
    })
    expect(drawerState.show).toBe(true)
    expect(onCloseMock).toHaveBeenCalledTimes(0)
    expect(drawerState.previousDrawer).toEqual(undefined)
    expect(drawerState.title).toBe('previousDrawerTitle')
  })
})
