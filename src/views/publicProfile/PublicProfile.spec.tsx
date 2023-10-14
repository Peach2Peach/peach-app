import { render, waitFor } from 'test-utils'
import { defaultUser } from '../../../tests/unit/data/userData'
import { NavigationAndQueryClientWrapper } from '../../../tests/unit/helpers/CustomWrapper'
import { queryClient } from '../../../tests/unit/helpers/QueryClientWrapper'
import { PublicProfile } from './PublicProfile'

jest.useFakeTimers()

jest.mock('../../utils/peachAPI', () => ({
  getUser: jest.fn(() => Promise.resolve([defaultUser, null])),
  getUserStatus: jest.fn(() => Promise.resolve({ isBlocked: false })),
}))
jest.mock('../../utils/peachAPI/private/user/getUserStatus', () => ({
  useUserStatus: jest.fn(() => ({ data: { isBlocked: false } })),
}))

jest.mock('@react-navigation/native', () => ({
  ...jest.requireActual('@react-navigation/native'),
  useRoute: jest.fn(() => ({ params: { userId: defaultUser.id } })),
}))

const DATE_TO_USE = new Date('2009-01-09')
jest.spyOn(global, 'Date').mockImplementation(() => DATE_TO_USE)
Date.now = jest.fn(() => DATE_TO_USE.getTime())

const wrapper = NavigationAndQueryClientWrapper

describe('PublicProfile', () => {
  it('should render correctly when loading', () => {
    const { toJSON } = render(<PublicProfile />, { wrapper })
    expect(toJSON()).toMatchSnapshot()
  })
  it('should render correctly when loaded', async () => {
    const { toJSON } = render(<PublicProfile />, { wrapper })

    await waitFor(() => {
      expect(queryClient.getQueryData(['user', defaultUser.id])).toEqual(defaultUser)
    })

    expect(toJSON()).toMatchSnapshot()
  })
})
