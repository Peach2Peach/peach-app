import { create } from 'react-test-renderer'
import { usePublicProfileNavigation } from '../../../../../hooks/usePublicProfileNavigation'
import { UserId } from './UserId'
import { View } from 'react-native'
import { createRenderer } from 'react-test-renderer/shallow'

jest.mock('../../../../../hooks/usePublicProfileNavigation', () => ({
  usePublicProfileNavigation: jest.fn(),
}))

jest.mock('../../../../../components/animation/Fade', () => ({
  Fade: () => <View />,
}))

describe('UserId', () => {
  const id = 'userId'

  afterEach(() => {
    jest.restoreAllMocks()
  })
  const shallowRenderer = createRenderer()
  it('should render correctly', () => {
    shallowRenderer.render(<UserId id={id} showInfo />)
    expect(shallowRenderer.getRenderOutput()).toMatchSnapshot()
  })
  it('should render correctly with a dispute', () => {
    shallowRenderer.render(<UserId id={id} showInfo isDispute />)
    expect(shallowRenderer.getRenderOutput()).toMatchSnapshot()
  })
  it('should set showInfo to false by default', () => {
    const testInstance = create(<UserId id={id} />).root
    expect(testInstance.props.showInfo).toBeFalsy()
  })
  it('should go to user profile if showInfo is true', () => {
    ;(usePublicProfileNavigation as jest.Mock).mockReturnValue(jest.fn())
    const showInfo = true
    const testInstance = create(<UserId {...{ id, showInfo }} />).root
    testInstance.findByProps({ testID: 'user-id' }).props.onPress()
    expect(usePublicProfileNavigation(id)).toHaveBeenCalled()
  })
})
