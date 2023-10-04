import Clipboard from '@react-native-clipboard/clipboard'
import { fireEvent, render } from '@testing-library/react-native'
import { create } from 'react-test-renderer'
import { createRenderer } from 'react-test-renderer/shallow'
import { UserId } from './UserId'

const publicProfileNavigationMock = jest.fn()
jest.mock('../../../../../hooks/usePublicProfileNavigation', () => ({
  usePublicProfileNavigation:
    () =>
      (...args: unknown[]) =>
        publicProfileNavigationMock(...args),
}))

describe('UserId', () => {
  const shallowRenderer = createRenderer()
  const id = 'userId'

  it('should render correctly', () => {
    shallowRenderer.render(<UserId id={id} showInfo />)
    expect(shallowRenderer.getRenderOutput()).toMatchSnapshot()
  })
  it('should set showInfo to false by default', () => {
    const testInstance = create(<UserId id={id} />).root
    expect(testInstance.props.showInfo).toBeFalsy()
  })
  it('should go to user profile if showInfo is true', () => {
    const showInfo = true
    const { getByText } = render(<UserId {...{ id, showInfo }} />)
    fireEvent.press(getByText('PeachuserId'))
    expect(publicProfileNavigationMock).toHaveBeenCalled()
  })
  it('should copy user id if showInfo is false', () => {
    const copySpy = jest.spyOn(Clipboard, 'setString')

    const showInfo = false
    const { getByText } = render(<UserId {...{ id, showInfo }} />)
    fireEvent.press(getByText('PeachuserId'))
    expect(copySpy).toHaveBeenCalledWith('PeachuserId')
  })
})
