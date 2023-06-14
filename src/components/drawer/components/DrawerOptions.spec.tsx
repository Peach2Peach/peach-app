import { DrawerOptions } from './DrawerOptions'
import { render } from '@testing-library/react-native'
import { defaultState, DrawerContext } from '../../../contexts/drawer'
import { Text } from '../../text'

jest.mock('./DrawerOption', () => ({
  DrawerOption: 'DrawerOption',
}))

describe('DrawerOptions', () => {
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

  afterEach(() => {
    updateDrawer(defaultState)
  })
  it('renders correctly', () => {
    const { toJSON } = render(<DrawerOptions />, { wrapper })
    expect(toJSON()).toMatchSnapshot()
  })
  it('renders correctly when there are options', () => {
    updateDrawer({
      options: [
        {
          title: 'testLabel',
          onPress: () => {},
        },
      ],
    })
    const { toJSON } = render(<DrawerOptions />, { wrapper })
    expect(toJSON()).toMatchSnapshot()
  })
  it('renders correctly when there are highlighted options', () => {
    updateDrawer({
      options: [
        {
          title: 'testLabel',
          subtext: 'testSubtext',
          onPress: () => {},
          highlighted: true,
        },
      ],
    })
    const { toJSON } = render(<DrawerOptions />, { wrapper })
    expect(toJSON()).toMatchSnapshot()
  })
  it('renders correctly when there is content', () => {
    updateDrawer({
      content: <Text>testContent</Text>,
    })
    const { toJSON } = render(<DrawerOptions />, { wrapper })
    expect(toJSON()).toMatchSnapshot()
  })
})
