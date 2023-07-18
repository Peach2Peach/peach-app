import { DrawerHeader } from './DrawerHeader'
import { act, fireEvent, render } from '@testing-library/react-native'
import { defaultState, DrawerContext } from '../../../contexts/drawer'

jest.mock('./GoBackIcon', () => ({
  GoBackIcon: 'GoBackIcon',
}))
jest.mock('./DrawerTitle', () => ({
  DrawerTitle: 'DrawerTitle',
}))
jest.mock('./CloseIcon', () => ({
  CloseIcon: 'CloseIcon',
}))

describe('DrawerHeader', () => {
  let drawerState = defaultState
  const updateDrawer = jest.fn((newDrawerState: Partial<DrawerState>) => {
    drawerState = {
      ...drawerState,
      ...newDrawerState,
    }
  })
  const wrapper = ({ children }: { children: JSX.Element }) => (
    <DrawerContext.Provider value={[drawerState, updateDrawer]}>{children}</DrawerContext.Provider>
  )

  const closeDrawerMock = jest.fn()

  afterEach(() => {
    updateDrawer(defaultState)
  })
  it('renders correctly', () => {
    const { toJSON } = render(<DrawerHeader closeDrawer={closeDrawerMock} />, { wrapper })
    expect(toJSON()).toMatchSnapshot()
  })
  it('renders correctly when the first option is highlighted', () => {
    updateDrawer({
      options: [
        {
          title: 'testLabel',
          subtext: 'testSubtext',
          highlighted: true,
          onPress: () => {},
        },
      ],
    })
    const { toJSON } = render(<DrawerHeader closeDrawer={closeDrawerMock} />, { wrapper })
    expect(toJSON()).toMatchSnapshot()
  })
  it('closes the drawer when the user swipes down more than 20px', () => {
    const { getByTestId } = render(<DrawerHeader closeDrawer={closeDrawerMock} />, { wrapper })
    const touchResponder = getByTestId('touchResponder')
    act(() => {
      fireEvent(touchResponder, 'touchStart', { nativeEvent: { pageY: 80 } })
    })
    act(() => {
      fireEvent(touchResponder, 'touchMove', { nativeEvent: { pageY: 100 } })
    })
    expect(closeDrawerMock).not.toHaveBeenCalled()
    act(() => {
      fireEvent(touchResponder, 'touchMove', { nativeEvent: { pageY: 101 } })
    })
    expect(closeDrawerMock).toHaveBeenCalled()
  })
  it("doesn't close the drawer when no touch start has been detected", () => {
    const { getByTestId } = render(<DrawerHeader closeDrawer={closeDrawerMock} />, { wrapper })
    const touchResponder = getByTestId('touchResponder')
    act(() => {
      fireEvent(touchResponder, 'touchMove', { nativeEvent: { pageY: 80 } })
      fireEvent(touchResponder, 'touchMove', { nativeEvent: { pageY: 101 } })
    })
    expect(closeDrawerMock).not.toHaveBeenCalled()
  })
})
