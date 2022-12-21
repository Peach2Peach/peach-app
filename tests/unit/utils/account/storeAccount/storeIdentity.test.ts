import { defaultAccount, setAccount } from '../../../../../src/utils/account'
import { accountStorage } from '../../../../../src/utils/account/accountStorage'
import { storeIdentity } from '../../../../../src/utils/account/storeAccount'
import * as accountData from '../../../data/accountData'
import { resetStorage } from '../../../prepare'

describe('storeIdentity', () => {
  beforeEach(async () => {
    await setAccount(defaultAccount)
  })
  afterEach(() => {
    resetStorage()
  })

  it('would store identity', async () => {
    await storeIdentity(accountData.account1)
    expect(accountStorage.setStringAsync).toHaveBeenCalledWith('publicKey', accountData.account1.publicKey)
    expect(accountStorage.setMapAsync).toHaveBeenCalledWith('identity', {
      publicKey: accountData.account1.publicKey,
      privKey: accountData.account1.privKey,
      mnemonic: accountData.account1.mnemonic,
      pgp: accountData.account1.pgp,
    })
  })
})
