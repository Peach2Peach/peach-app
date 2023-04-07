import { defaultAccount, setAccount } from '..'
import { accountStorage } from '../accountStorage'
import { storeSettings } from '.'
import * as accountData from '../../../../tests/unit/data/accountData'

describe('storeSettings', () => {
  beforeEach(async () => {
    await setAccount(defaultAccount)
  })

  it('would store settings', async () => {
    await storeSettings(accountData.account1.settings)
    expect(accountStorage.setMap).toHaveBeenCalledWith('settings', accountData.account1.settings)
  })
})
