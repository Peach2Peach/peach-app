import { defaultAccount, setAccount } from '../../../../../src/utils/account'
import { storeSettings } from '../../../../../src/utils/account/storeAccount'
import * as fileUtils from '../../../../../src/utils/file'
import * as accountData from '../../../data/accountData'
import { resetFakeFiles } from '../../../prepare'

const password = 'supersecret'

jest.mock('../../../../../src/utils/file', () => ({
  __esModule: true,
  ...jest.requireActual('../../../../../src/utils/file'),
}))

describe('storeSettings', () => {
  let writeFileSpy: jest.SpyInstance
  beforeEach(async () => {
    writeFileSpy = jest.spyOn(fileUtils, 'writeFile')

    await setAccount(defaultAccount)
    await storeSettings(defaultAccount.settings, password)
  })
  afterEach(() => {
    resetFakeFiles()
    writeFileSpy.mockClear()
  })

  it('would write file to store settings', async () => {
    await storeSettings(accountData.account1.settings, password)
    expect(writeFileSpy).toHaveBeenCalledWith(
      '/peach-account-settings.json',
      JSON.stringify(accountData.account1.settings),
      password,
    )
  })
})
