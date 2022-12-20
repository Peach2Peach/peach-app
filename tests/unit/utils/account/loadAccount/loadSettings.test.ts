import { deepStrictEqual } from 'assert'
import { defaultAccount, setAccount, storeSettings } from '../../../../../src/utils/account'
import { accountStorage } from '../../../../../src/utils/account/accountStorage'
import { loadSettings } from '../../../../../src/utils/account/loadAccount'
import * as accountData from '../../../data/accountData'
import { resetStorage } from '../../../prepare'

describe('loadSettings', () => {
  beforeEach(async () => {
    await setAccount(defaultAccount, true)
  })
  afterEach(() => {
    resetStorage()
  })

  it('loads settings', async () => {
    await storeSettings(accountData.account1.settings)

    const settings = await loadSettings()
    expect(accountStorage.getMap).toHaveBeenCalledWith('settings')
    deepStrictEqual(settings, accountData.account1.settings)
  })
})
