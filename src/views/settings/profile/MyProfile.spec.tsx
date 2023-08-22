import { render, waitFor } from '@testing-library/react-native'
import { apiSuccess } from '../../../../tests/unit/data/peachAPIData'
import { defaultSelfUser } from '../../../../tests/unit/data/userData'
import { NavigationAndQueryClientWrapper } from '../../../../tests/unit/helpers/NavigationAndQueryClientWrapper'
import { queryClient } from '../../../../tests/unit/helpers/QueryClientWrapper'
import { MyProfile } from './MyProfile'

const wrapper = NavigationAndQueryClientWrapper

const authMock = jest.fn().mockResolvedValue([apiSuccess, null])
const getSelfUser = jest.fn().mockResolvedValue([defaultSelfUser, null])
jest.mock('../../../utils/peachAPI', () => ({
  auth: (...args: unknown[]) => authMock(...args),
  getSelfUser: (...args: unknown[]) => getSelfUser(...args),
}))

jest.useFakeTimers()

describe('MyProfile', () => {
  it('should render correctly', async () => {
    const { toJSON } = render(<MyProfile />, { wrapper })

    await waitFor(() => {
      expect(queryClient.getQueryData(['user', 'self'])).toEqual(defaultSelfUser)
    })

    expect(toJSON()).toMatchSnapshot()
  })
})
