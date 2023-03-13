import Share from 'react-native-share'
import { backupAccount, setAccount } from '../../../../src/utils/account'
import * as accountData from '../../data/accountData'
import { resetFakeFiles } from '../../prepare'

describe('backupAccount', () => {
  let openSpy: jest.SpyInstance

  beforeAll(async () => {
    openSpy = jest.spyOn(Share, 'open')
    await setAccount(accountData.account1, true)
  })
  afterEach(() => {
    resetFakeFiles()
    openSpy.mockReset()
  })

  it('opens share dialog', async () => {
    await backupAccount({ password: 'password', onSuccess: () => {}, onCancel: () => {}, onError: () => {} })
    expect(openSpy).toHaveBeenCalled()
  })
})
