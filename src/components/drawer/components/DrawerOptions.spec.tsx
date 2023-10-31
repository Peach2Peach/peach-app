import { act, render } from 'test-utils'
import { PeachScrollView } from '../../PeachScrollView'
import { Text } from '../../text'
import { defaultState, useDrawerState } from '../useDrawerState'
import { DrawerOptions } from './DrawerOptions'

jest.mock('./DrawerOption', () => ({
  DrawerOption: 'DrawerOption',
}))

describe('DrawerOptions', () => {
  const updateDrawer = useDrawerState.setState
  beforeEach(() => {
    updateDrawer(defaultState)
  })
  it('renders correctly', () => {
    const { toJSON } = render(<DrawerOptions />)
    expect(toJSON()).toMatchSnapshot()
  })
  it('renders correctly when there are options', () => {
    updateDrawer({
      options: [
        {
          title: 'testLabel',
          onPress: jest.fn(),
        },
      ],
    })
    const { toJSON } = render(<DrawerOptions />)
    expect(toJSON()).toMatchSnapshot()
  })
  it('renders correctly when there are highlighted options', () => {
    updateDrawer({
      options: [
        {
          title: 'testLabel',
          subtext: 'testSubtext',
          onPress: jest.fn(),
          highlighted: true,
        },
      ],
    })
    const { toJSON } = render(<DrawerOptions />)
    expect(toJSON()).toMatchSnapshot()
  })
  it('renders correctly when there is content', () => {
    updateDrawer({
      content: <Text>testContent</Text>,
    })
    const { toJSON } = render(<DrawerOptions />)
    expect(toJSON()).toMatchSnapshot()
  })
  it('should scroll back to the top when either options or content changes', () => {
    updateDrawer({
      options: [
        {
          title: 'testLabel',
          onPress: jest.fn(),
        },
      ],
    })
    const { rerender, UNSAFE_getByType } = render(<DrawerOptions />)
    // @ts-ignore
    const scrollViewRef = UNSAFE_getByType(PeachScrollView)._fiber.ref.current
    expect(scrollViewRef.scrollTo).toHaveBeenCalledWith({ y: 0, animated: false })
    act(() => {
      updateDrawer({
        content: <Text>testContent</Text>,
      })
      rerender(<DrawerOptions />)
    })

    expect(scrollViewRef.scrollTo).toHaveBeenCalledTimes(2)
    expect(scrollViewRef.scrollTo).toHaveBeenLastCalledWith({ y: 0, animated: false })
  })
})
