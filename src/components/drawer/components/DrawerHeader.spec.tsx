import { act, fireEvent, render } from 'test-utils'
import { defaultState, useDrawerState } from '../useDrawerState'
import { DrawerHeader } from './DrawerHeader'

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
  const closeDrawerMock = jest.fn()
  const updateDrawer = useDrawerState.setState

  afterEach(() => {
    updateDrawer(defaultState)
  })
  it('renders correctly', () => {
    const { toJSON } = render(<DrawerHeader closeDrawer={closeDrawerMock} />)
    expect(toJSON()).toMatchSnapshot()
  })
  it('renders correctly when the first option is highlighted', () => {
    updateDrawer({
      options: [
        {
          title: 'testLabel',
          subtext: 'testSubtext',
          highlighted: true,
          onPress: jest.fn(),
        },
      ],
    })
    const { toJSON } = render(<DrawerHeader closeDrawer={closeDrawerMock} />)
    expect(toJSON()).toMatchSnapshot()
  })
  it('closes the drawer when the user swipes down more than 20px', () => {
    const { getByTestId } = render(<DrawerHeader closeDrawer={closeDrawerMock} />)
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
    const { getByTestId } = render(<DrawerHeader closeDrawer={closeDrawerMock} />)
    const touchResponder = getByTestId('touchResponder')
    act(() => {
      fireEvent(touchResponder, 'touchMove', { nativeEvent: { pageY: 80 } })
      fireEvent(touchResponder, 'touchMove', { nativeEvent: { pageY: 101 } })
    })
    expect(closeDrawerMock).not.toHaveBeenCalled()
  })
})
