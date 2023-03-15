import { defaultAccount, setAccount } from '..'
import { accountStorage } from '../accountStorage'
import { storeIdentity } from '.'
import * as accountData from '../../../../tests/unit/data/accountData'
import { resetStorage } from '../../../../tests/unit/prepare'

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
