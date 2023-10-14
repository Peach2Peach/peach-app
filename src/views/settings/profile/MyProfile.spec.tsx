import { render, waitFor } from 'test-utils'
import { apiSuccess } from '../../../../tests/unit/data/peachAPIData'
import { defaultSelfUser } from '../../../../tests/unit/data/userData'
import { NavigationAndQueryClientWrapper } from '../../../../tests/unit/helpers/CustomWrapper'
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
const DATE_TO_USE = new Date('2009-09-01')
jest.spyOn(global, 'Date').mockImplementation(() => DATE_TO_USE)
Date.now = jest.fn(() => DATE_TO_USE.getTime())

describe('MyProfile', () => {
  it('should render correctly', async () => {
    const { toJSON } = render(<MyProfile />, { wrapper })

    await waitFor(() => {
      expect(queryClient.getQueryData(['user', 'self'])).toEqual(defaultSelfUser)
    })

    expect(toJSON()).toMatchSnapshot()
  })
})
