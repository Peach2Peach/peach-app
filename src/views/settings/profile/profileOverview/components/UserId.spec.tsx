import Clipboard from '@react-native-clipboard/clipboard'
import { fireEvent, render } from '@testing-library/react-native'
import { NavigationWrapper, navigateMock } from '../../../../../../tests/unit/helpers/NavigationWrapper'
import { UserId } from './UserId'

describe('UserId', () => {
  const id = 'userId'

  it('should render correctly', () => {
    const { toJSON } = render(<UserId id={id} />, { wrapper: NavigationWrapper })
    expect(toJSON()).toMatchSnapshot()
  })
  it('should go to user profile if showInfo is true', () => {
    const showInfo = true
    const { getByText } = render(<UserId {...{ id, showInfo }} />, { wrapper: NavigationWrapper })
    fireEvent.press(getByText('PeachuserId'))
    expect(navigateMock).toHaveBeenCalledWith('publicProfile', { userId: id })
  })
  it('should copy user id if showInfo is false', () => {
    const copySpy = jest.spyOn(Clipboard, 'setString')

    const showInfo = false
    const { getByText } = render(<UserId {...{ id, showInfo }} />, { wrapper: NavigationWrapper })
    fireEvent.press(getByText('PeachuserId'))
    expect(copySpy).toHaveBeenCalledWith('PeachuserId')
  })
})
