import { account1 } from '../../tests/unit/data/accountData'
import { settingsStore } from '../store/settingsStore'
import { defaultAccount, setAccount } from '../utils/account'
import { publishPGPPublicKey } from './publishPGPPublicKey'

const updateUserMock = jest.fn().mockResolvedValue([{ success: true }, null])
jest.mock('../utils/peachAPI', () => ({
  updateUser: (...args: any[]) => updateUserMock(...args),
}))
describe('publishPGPPublicKey', () => {
  afterEach(async () => {
    jest.clearAllMocks()
    await setAccount(defaultAccount)
  })

  it('does not send pgp key to server if there is no data to be sent', async () => {
    settingsStore.setState({
      pgpPublished: true,
    })
    await publishPGPPublicKey()
    expect(updateUserMock).not.toHaveBeenCalled()
  })
  it('does send pgp key to server if there is data to send and has not been sent yet', async () => {
    await setAccount(account1)
    settingsStore.setState({
      pgpPublished: false,
    })
    await publishPGPPublicKey()
    expect(updateUserMock).toHaveBeenCalledWith({
      pgp: account1.pgp,
    })
  })
  it('should handle updateUser errors', async () => {
    await setAccount(account1)
    settingsStore.setState({
      pgpPublished: false,
    })
    updateUserMock.mockResolvedValue([null, { error: 'error' }])
    await publishPGPPublicKey()
    expect(updateUserMock).toHaveBeenCalledWith({
      pgp: account1.pgp,
    })
    expect(settingsStore.getState().pgpPublished).toBe(false)
  })
  it('should catch errors', async () => {
    await setAccount(account1)
    settingsStore.setState({
      pgpPublished: false,
    })
    updateUserMock.mockRejectedValue(new Error('error'))
    await publishPGPPublicKey()
    expect(updateUserMock).toHaveBeenCalledWith({
      pgp: account1.pgp,
    })
    expect(settingsStore.getState().pgpPublished).toBe(false)
  })
})
