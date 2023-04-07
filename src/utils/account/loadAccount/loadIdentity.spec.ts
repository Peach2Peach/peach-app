import { deepStrictEqual } from 'assert'
import { defaultAccount, setAccount, storeIdentity } from '..'
import { accountStorage } from '../accountStorage'
import { loadIdentity } from '.'
import * as accountData from '../../../../tests/unit/data/accountData'

describe('loadIdentity', () => {
  beforeEach(async () => {
    await setAccount(defaultAccount, true)
  })

  it('loads identity', async () => {
    await storeIdentity(accountData.account1)

    const identity = await loadIdentity()
    expect(accountStorage.getMap).toHaveBeenCalledWith('identity')
    deepStrictEqual(identity, {
      publicKey: accountData.account1.publicKey,
      privKey: accountData.account1.privKey,
      mnemonic: accountData.account1.mnemonic,
      pgp: accountData.account1.pgp,
    })
  })
})
