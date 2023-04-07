import { defaultAccount, setAccount } from '..'
import { accountStorage } from '../accountStorage'
import { storeIdentity } from '.'
import * as accountData from '../../../../tests/unit/data/accountData'

describe('storeIdentity', () => {
  beforeEach(async () => {
    await setAccount(defaultAccount)
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
