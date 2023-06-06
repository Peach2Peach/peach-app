import { render } from '@testing-library/react-native'
import { headerState, NavigationWrapper } from '../../../../tests/unit/helpers/NavigationWrapper'
import { QueryClientWrapper } from '../../../../tests/unit/helpers/QueryClientWrapper'
import MyProfile from './MyProfile'
import { apiSuccess } from '../../../../tests/unit/data/peachAPIData'

const wrapper = ({ children }: ComponentProps) => (
  <NavigationWrapper>
    <QueryClientWrapper>{children}</QueryClientWrapper>
  </NavigationWrapper>
)

const authMock = jest.fn().mockResolvedValue([apiSuccess, null])
jest.mock('../../../utils/peachAPI', () => ({
  auth: (...args: any[]) => authMock(...args),
}))

jest.useFakeTimers()

describe('MyProfile', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should set up header correctly', () => {
    render(<MyProfile />, { wrapper })
    expect(headerState.header()).toMatchSnapshot()
  })
})
