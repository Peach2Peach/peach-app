import { deepStrictEqual } from 'assert'
import { defaultAccount, setAccount, storeSettings } from '..'
import { accountStorage } from '../accountStorage'
import { loadSettings } from '.'
import * as accountData from '../../../../tests/unit/data/accountData'

describe('loadSettings', () => {
  beforeEach(async () => {
    await setAccount(defaultAccount, true)
  })

  it('loads settings', async () => {
    await storeSettings(accountData.account1.settings)

    const settings = await loadSettings()
    expect(accountStorage.getMap).toHaveBeenCalledWith('settings')
    deepStrictEqual(settings, accountData.account1.settings)
  })
})
