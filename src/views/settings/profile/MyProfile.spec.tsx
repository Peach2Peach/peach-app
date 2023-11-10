import { render, waitFor } from 'test-utils'
import { apiSuccess } from '../../../../tests/unit/data/peachAPIData'
import { defaultUser } from '../../../../tests/unit/data/userData'
import { queryClient } from '../../../../tests/unit/helpers/QueryClientWrapper'
import { MyProfile } from './MyProfile'

const authMock = jest.fn().mockResolvedValue([apiSuccess, null])
jest.mock('../../../utils/peachAPI/private/user', () => ({
  auth: (...args: unknown[]) => authMock(...args),
}))

jest.useFakeTimers()
const DATE_TO_USE = new Date('2009-09-01')
jest.spyOn(global, 'Date').mockImplementation(() => DATE_TO_USE)
Date.now = jest.fn(() => DATE_TO_USE.getTime())

describe('MyProfile', () => {
  it('should render correctly', async () => {
    const { toJSON } = render(<MyProfile />)

    await waitFor(() => {
      expect(queryClient.getQueryData(['user', 'self'])).toEqual(defaultUser)
    })

    expect(toJSON()).toMatchSnapshot()
  })
})
