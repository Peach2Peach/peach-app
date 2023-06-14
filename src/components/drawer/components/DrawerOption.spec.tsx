import { fireEvent, render } from '@testing-library/react-native'
import { DrawerOption } from './DrawerOption'

describe('DrawerOption', () => {
  it('should render correctly with title and iconRightID', () => {
    const { toJSON } = render(<DrawerOption title="title" iconRightID="bitcoinLogo" onPress={() => {}} />)
    expect(toJSON()).toMatchSnapshot()
  })
  it('should render correctly with only title', () => {
    const { toJSON } = render(<DrawerOption title="title" onPress={() => {}} />)
    expect(toJSON()).toMatchSnapshot()
  })
  it('should render correctly with title, subtext and iconRightID', () => {
    const { toJSON } = render(
      <DrawerOption title="title" subtext="subtext" iconRightID="bitcoinLogo" onPress={() => {}} />,
    )
    expect(toJSON()).toMatchSnapshot()
  })
  it('should render correctly when highlighted', () => {
    const { toJSON } = render(<DrawerOption title="title" subtext="subtext" highlighted onPress={() => {}} />)
    expect(toJSON()).toMatchSnapshot()
  })
  it('should render correctly with title and subtext', () => {
    const { toJSON } = render(<DrawerOption title="title" subtext="subtext" onPress={() => {}} />)
    expect(toJSON()).toMatchSnapshot()
  })
  it('should render correctly with title, logoID and iconRightID', () => {
    const { toJSON } = render(
      <DrawerOption title="title" logoID="advcash" iconRightID="bitcoinLogo" onPress={() => {}} />,
    )
    expect(toJSON()).toMatchSnapshot()
  })
  it('should render correctly with title and logoID', () => {
    const { toJSON } = render(<DrawerOption title="title" logoID="advcash" onPress={() => {}} />)
    expect(toJSON()).toMatchSnapshot()
  })
  it('should render correctly with title, flagID and iconRightID', () => {
    const { toJSON } = render(<DrawerOption title="title" flagID="DE" iconRightID="bitcoinLogo" onPress={() => {}} />)
    expect(toJSON()).toMatchSnapshot()
  })
  it('should render correctly with title and flagID', () => {
    const { toJSON } = render(<DrawerOption title="title" flagID="DE" onPress={() => {}} />)
    expect(toJSON()).toMatchSnapshot()
  })
  it('should render correctly with title, subtext, flagID and iconRightID', () => {
    const { toJSON } = render(
      <DrawerOption title="title" subtext="subtext" flagID="DE" iconRightID="bitcoinLogo" onPress={() => {}} />,
    )
    expect(toJSON()).toMatchSnapshot()
  })
  it('should render correctly with title, subtext and flagID', () => {
    const { toJSON } = render(<DrawerOption title="title" subtext="subtext" flagID="DE" onPress={() => {}} />)
    expect(toJSON()).toMatchSnapshot()
  })
  it('should call onPress when pressed', () => {
    const onPress = jest.fn()
    const { getByText } = render(<DrawerOption title="title" onPress={onPress} />)
    fireEvent.press(getByText('title'))
    expect(onPress).toHaveBeenCalled()
  })
})
