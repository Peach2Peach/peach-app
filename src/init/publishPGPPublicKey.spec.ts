import { account1 } from '../../tests/unit/data/accountData'
import { useSettingsStore } from '../store/settingsStore/useSettingsStore'
import { defaultAccount, setAccount } from '../utils/account/account'
import { publishPGPPublicKey } from './publishPGPPublicKey'

const updateUserMock = jest.fn().mockResolvedValue([{ success: true }, null])
jest.mock('../utils/peachAPI/updateUser', () => ({
  updateUser: (...args: unknown[]) => updateUserMock(...args),
}))
describe('publishPGPPublicKey', () => {
  afterEach(() => {
    setAccount(defaultAccount)
  })

  it('does not send pgp key to server if there is no data to be sent', async () => {
    useSettingsStore.setState({
      pgpPublished: true,
    })
    await publishPGPPublicKey()
    expect(updateUserMock).not.toHaveBeenCalled()
  })
  it('does send pgp key to server if there is data to send and has not been sent yet', async () => {
    setAccount(account1)
    useSettingsStore.setState({
      pgpPublished: false,
    })
    await publishPGPPublicKey()
    expect(updateUserMock).toHaveBeenCalledWith({
      pgp: account1.pgp,
    })
  })
  it('should handle updateUser errors', async () => {
    setAccount(account1)
    useSettingsStore.setState({
      pgpPublished: false,
    })
    updateUserMock.mockResolvedValue([null, { error: 'error' }])
    await publishPGPPublicKey()
    expect(updateUserMock).toHaveBeenCalledWith({
      pgp: account1.pgp,
    })
    expect(useSettingsStore.getState().pgpPublished).toBe(false)
  })
  it('should catch errors', async () => {
    setAccount(account1)
    useSettingsStore.setState({
      pgpPublished: false,
    })
    updateUserMock.mockRejectedValue(new Error('error'))
    await publishPGPPublicKey()
    expect(updateUserMock).toHaveBeenCalledWith({
      pgp: account1.pgp,
    })
    expect(useSettingsStore.getState().pgpPublished).toBe(false)
  })
})
