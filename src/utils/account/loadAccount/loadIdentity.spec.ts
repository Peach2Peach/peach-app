import { deepStrictEqual } from 'assert'
import { defaultAccount, setAccount, storeIdentity } from '..'
import { accountStorage } from '../accountStorage'
import { loadIdentity } from '.'
import { account1 } from '../../../../tests/unit/data/accountData'

describe('loadIdentity', () => {
  it('loads identity', async () => {
    await storeIdentity(account1)

    const identity = await loadIdentity()
    expect(accountStorage.getMap).toHaveBeenCalledWith('identity')
    deepStrictEqual(identity, {
      publicKey: account1.publicKey,
      privKey: account1.privKey,
      mnemonic: account1.mnemonic,
      base58: account1.base58,
      pgp: account1.pgp,
    })
  })
})
