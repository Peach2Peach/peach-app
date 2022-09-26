import { defaultAccount, setAccount } from '../../../../src/utils/account'
import { storeSettings } from '../../../../src/utils/account/storeAccount'
import * as fileUtils from '../../../../src/utils/file'
import * as accountData from '../../data/accountData'
import { resetFakeFiles } from '../../prepare'

const password = 'supersecret'

describe('storeSettings', () => {
  beforeEach(async () => {
    await setAccount(defaultAccount)
    await storeSettings(defaultAccount.settings, password)
  })
  afterEach(() => {
    resetFakeFiles()
    jest.clearAllMocks()
  })

  it('would write file to store settings', async () => {
    const writeFileSpy = jest.spyOn(fileUtils, 'writeFile')
    await storeSettings(accountData.account1.settings, password)
    expect(writeFileSpy).toHaveBeenCalledWith(
      '/peach-account-settings.json',
      JSON.stringify(accountData.account1.settings),
      password,
    )
  })
})
