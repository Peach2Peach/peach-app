import { defaultAccount, setAccount } from '..'
import { accountStorage } from '../accountStorage'
import { storeIdentity } from '.'
import { account1 } from '../../../../tests/unit/data/accountData'

describe('storeIdentity', () => {
  beforeEach(() => {
    setAccount(defaultAccount)
  })

  it('would store identity', async () => {
    await storeIdentity(account1)
    expect(accountStorage.setStringAsync).toHaveBeenCalledWith('publicKey', account1.publicKey)
    expect(accountStorage.setMapAsync).toHaveBeenCalledWith('identity', {
      publicKey: account1.publicKey,
      privKey: account1.privKey,
      base58: account1.base58,
      mnemonic: account1.mnemonic,
      pgp: account1.pgp,
    })
  })
})
