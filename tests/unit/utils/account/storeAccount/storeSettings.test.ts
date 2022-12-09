import { defaultAccount, setAccount } from '../../../../../src/utils/account'
import { accountStorage } from '../../../../../src/utils/account/accountStorage'
import { storeSettings } from '../../../../../src/utils/account/storeAccount'
import * as accountData from '../../../data/accountData'
import { resetStorage } from '../../../prepare'

describe('storeSettings', () => {
  beforeEach(async () => {
    await setAccount(defaultAccount)
  })
  afterEach(() => {
    resetStorage()
  })

  it('would store settings', async () => {
    await storeSettings(accountData.account1.settings)
    expect(accountStorage.setMap).toHaveBeenCalledWith('settings', accountData.account1.settings)
  })
})
