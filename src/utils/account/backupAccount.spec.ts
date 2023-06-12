import Share from 'react-native-share'
import { backupAccount, setAccount } from '.'
import * as accountData from '../../../tests/unit/data/accountData'

describe('backupAccount', () => {
  const openSpy = jest.spyOn(Share, 'open')

  beforeAll(() => {
    setAccount(accountData.account1)
  })
  afterEach(() => {
    openSpy.mockReset()
  })

  it('opens share dialog', async () => {
    await backupAccount({ password: 'password', onSuccess: () => {}, onCancel: () => {}, onError: () => {} })
    expect(openSpy).toHaveBeenCalled()
  })
})
