import Share from 'react-native-share'
import * as accountData from '../../../tests/unit/data/accountData'
import { setAccount } from './account'
import { backupAccount } from './backupAccount'

describe('backupAccount', () => {
  const openSpy = jest.spyOn(Share, 'open')

  beforeAll(() => {
    setAccount(accountData.account1)
  })
  afterEach(() => {
    openSpy.mockReset()
  })

  it('opens share dialog', async () => {
    await backupAccount({ password: 'password', onSuccess: jest.fn(), onCancel: jest.fn(), onError: jest.fn() })
    expect(openSpy).toHaveBeenCalled()
  })
})
