import Share from 'react-native-share'
import { backupAccount, setAccount } from '../../../../src/utils/account'
import * as accountData from '../../data/accountData'
import { resetFakeFiles } from '../../prepare'

describe('backupAccount', () => {
  beforeAll(async () => {
    await setAccount(accountData.account1)
  })
  afterEach(() => {
    resetFakeFiles()
    jest.clearAllMocks()
  })

  it('opens share dialog', async () => {
    const openSpy = jest.spyOn(Share, 'open')
    await backupAccount({ onSuccess: () => {}, onError: () => {} })
    expect(openSpy).toBeCalled()
  })
})
