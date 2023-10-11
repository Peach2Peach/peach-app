import { fireEvent, render } from 'test-utils'
import { DrawerContext, defaultState } from '../../../contexts/drawer'
import { Icon } from '../../Icon'
import { GoBackIcon } from './GoBackIcon'

describe('GoBackIcon', () => {
  let drawerState = {
    ...defaultState,
  }
  const updateDrawer = jest.fn((newDrawerState: Partial<DrawerState>) => {
    drawerState = {
      ...drawerState,
      ...newDrawerState,
    }
  })

  const wrapper = ({ children }: { children: JSX.Element }) => (
    <DrawerContext.Provider value={[drawerState, updateDrawer]}>{children}</DrawerContext.Provider>
  )
  afterEach(() => {
    updateDrawer(defaultState)
  })
  it('renders correctly', () => {
    updateDrawer({
      previousDrawer: {
        title: 'testTitle',
        content: 'testContent',
        options: [],
        show: true,
        previousDrawer: undefined,
        onClose: jest.fn(),
      },
    })
    const { toJSON } = render(<GoBackIcon />, { wrapper })
    expect(toJSON()).toMatchSnapshot()
  })
  it('should render correctly when there is no previous drawer', () => {
    const { toJSON } = render(<GoBackIcon />, { wrapper })
    expect(toJSON()).toMatchSnapshot()
  })
  it('should update the drawer to the previous drawer when pressed', () => {
    updateDrawer({
      previousDrawer: {
        title: 'testTitle',
        content: 'testContent',
        options: [],
        show: true,
        previousDrawer: undefined,
        onClose: jest.fn(),
      },
    })
    const { UNSAFE_getByType } = render(<GoBackIcon />, { wrapper })
    fireEvent.press(UNSAFE_getByType(Icon))
    expect(updateDrawer).toHaveBeenCalled()
  })
  it('should not update the drawer to the previous drawer when pressed if there is no previous drawer', () => {
    const { UNSAFE_getByType } = render(<GoBackIcon />, { wrapper })
    fireEvent.press(UNSAFE_getByType(Icon))
    expect(updateDrawer).not.toHaveBeenCalled()
  })
})
