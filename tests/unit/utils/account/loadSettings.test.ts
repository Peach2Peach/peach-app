import { deepStrictEqual } from 'assert'
import { defaultAccount, setAccount } from '../../../../src/utils/account'
import { loadSettings } from '../../../../src/utils/account/loadAccount'
import { storeSettings } from '../../../../src/utils/account/storeAccount'
import * as accountData from '../../data/accountData'
import { resetFakeFiles } from '../../prepare'

const password = 'supersecret'

describe('loadSettings', () => {
  beforeEach(async () => {
    await setAccount(defaultAccount)
  })
  afterEach(() => {
    resetFakeFiles()
    jest.clearAllMocks()
  })

  it('loads settings', async () => {
    await storeSettings(accountData.account1.settings, password)
    const settings = await loadSettings(password)
    deepStrictEqual(settings, accountData.account1.settings)
  })
})
