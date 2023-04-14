import { account1 } from '../../tests/unit/data/accountData'
import { settingsStore } from '../store/settingsStore'
import { defaultAccount, setAccount } from '../utils/account'
import pgp from './pgp'

const updateUserMock = jest.fn().mockResolvedValue([{ success: true }, null])
jest.mock('../utils/peachAPI', () => ({
  updateUser: (...args: any[]) => updateUserMock(...args),
}))
describe('pgp', () => {
  afterEach(async () => {
    jest.clearAllMocks()
    await setAccount(defaultAccount)
  })

  it('does not send pgp key to server if there is it already has been sent', async () => {
    settingsStore.setState({
      pgpPublished: true,
    })
    await pgp()
    expect(updateUserMock).not.toHaveBeenCalled()
  })
  it('does send pgp key to server if there is data to send and has not been sent yet', async () => {
    await setAccount(account1)
    settingsStore.setState({
      pgpPublished: false,
    })
    await pgp()
    expect(updateUserMock).toHaveBeenCalledWith({
      pgp: account1.pgp,
    })
  })
})
