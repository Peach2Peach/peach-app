import { account1 } from '../../tests/unit/data/accountData'
import { settingsStore } from '../store/settingsStore'
import { defaultAccount, setAccount } from '../utils/account'
import { userUpdate } from './userUpdate'

const getTokenMock = jest.fn()
jest.mock('@react-native-firebase/messaging', () => () => ({
  getToken: async () => await getTokenMock(),
}))

const updateUserMock = jest.fn().mockResolvedValue([{ success: true }, null])
jest.mock('../utils/peachAPI', () => ({
  updateUser: (...args: any[]) => updateUserMock(...args),
}))
describe('userUpdate', () => {
  const fcmToken = 'fcmToken'
  const referralCode = 'referralCode'
  afterEach(async () => {
    jest.clearAllMocks()
    await setAccount(defaultAccount)
  })

  it('does not send updates to server if there is no data to send', async () => {
    await userUpdate()
    expect(updateUserMock).not.toHaveBeenCalled()
  })
  it('does send updates to server if there is data to send', async () => {
    const newToken = 'otherToken'
    await setAccount(account1)
    getTokenMock.mockResolvedValueOnce(newToken)
    settingsStore.setState({
      fcmToken,
      pgpPublished: false,
    })
    await userUpdate(referralCode)
    expect(getTokenMock).toHaveBeenCalled()
    expect(updateUserMock).toHaveBeenCalledWith({
      referralCode,
      fcmToken: newToken,
      pgp: account1.pgp,
    })
  })
})
