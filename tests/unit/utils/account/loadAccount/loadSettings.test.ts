import { deepStrictEqual } from 'assert'
import { defaultAccount, setAccount, storeAccount } from '../../../../../src/utils/account'
import { loadSettings } from '../../../../../src/utils/account/loadAccount'
import * as file from '../../../../../src/utils/file'
import * as accountData from '../../../data/accountData'
import { resetFakeFiles } from '../../../prepare'

const password = 'supersecret'

describe('loadSettings', () => {
  beforeEach(async () => {
    await setAccount(defaultAccount, true)
  })
  afterEach(() => {
    resetFakeFiles()
    jest.clearAllMocks()
  })

  it('loads settings from files', async () => {
    const readFileSpy = jest.spyOn(file, 'readFile')

    await storeAccount(accountData.account1, password)

    const settings = await loadSettings(password)
    expect(readFileSpy).toHaveBeenCalledWith('/peach-account-settings.json', password)
    deepStrictEqual(settings, accountData.account1.settings)
  })
})
