import { render, waitFor } from '@testing-library/react-native'
import { defaultUser } from '../../../tests/unit/data/userData'
import { NavigationAndQueryClientWrapper } from '../../../tests/unit/helpers/NavigationAndQueryClientWrapper'
import { queryClient } from '../../../tests/unit/helpers/QueryClientWrapper'
import { PublicProfile } from './PublicProfile'
import { useProfileStore } from './store'

jest.useFakeTimers()

jest.mock('../../utils/peachAPI', () => ({
  getUser: jest.fn(() => Promise.resolve([defaultUser, null])),
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
    useProfileStore.setState({ currentUserPubkey: defaultUser.id })
    const { toJSON } = render(<PublicProfile />, { wrapper })

    await waitFor(() => {
      expect(queryClient.getQueryData(['user', defaultUser.id])).toEqual(defaultUser)
    })

    expect(toJSON()).toMatchSnapshot()
  })
})
