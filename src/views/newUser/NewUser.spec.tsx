import { createRenderer } from 'react-test-renderer/shallow'
import NewUser from './NewUser'

const useNewUserSetupMock = jest.fn().mockReturnValue({
  success: false,
  error: undefined,
  userExistsForDevice: false,
})
jest.mock('./hooks/useNewUserSetup', () => ({
  useNewUserSetup: () => useNewUserSetupMock(),
}))

describe('NewUser', () => {
  const shallowRenderer = createRenderer()
  it('should render correctly while loading', () => {
    shallowRenderer.render(<NewUser />)
    expect(shallowRenderer.getRenderOutput()).toMatchSnapshot()
  })
  it('should render correctly for error', () => {
    useNewUserSetupMock.mockReturnValueOnce({
      success: false,
      error: 'UNKNOWN_ERROR',
      userExistsForDevice: false,
    })
    shallowRenderer.render(<NewUser />)
    expect(shallowRenderer.getRenderOutput()).toMatchSnapshot()
  })
  it('should render for existing user', () => {
    useNewUserSetupMock.mockReturnValueOnce({
      success: false,
      error: undefined,
      userExistsForDevice: true,
    })
    shallowRenderer.render(<NewUser />)
    expect(shallowRenderer.getRenderOutput()).toMatchSnapshot()
  })
  it('should render for when successful', () => {
    useNewUserSetupMock.mockReturnValueOnce({
      success: true,
      error: undefined,
      userExistsForDevice: false,
    })
    shallowRenderer.render(<NewUser />)
    expect(shallowRenderer.getRenderOutput()).toMatchSnapshot()
  })
})
