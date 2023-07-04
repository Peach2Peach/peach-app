import { render } from '@testing-library/react-native'
import { apiSuccess } from '../../../../tests/unit/data/peachAPIData'
import { NavigationAndQueryClientWrapper } from '../../../../tests/unit/helpers/NavigationAndQueryClientWrapper'
import { headerState } from '../../../../tests/unit/helpers/NavigationWrapper'
import MyProfile from './MyProfile'

const wrapper = NavigationAndQueryClientWrapper

const authMock = jest.fn().mockResolvedValue([apiSuccess, null])
jest.mock('../../../utils/peachAPI', () => ({
  auth: (...args: any[]) => authMock(...args),
}))

jest.useFakeTimers()

describe('MyProfile', () => {
  it('should set up header correctly', () => {
    render(<MyProfile />, { wrapper })
    expect(headerState.header()).toMatchSnapshot()
  })
})
