import { deepStrictEqual } from 'assert'
import { defaultAccount, setAccount, storeIdentity } from '../../../../../src/utils/account'
import { accountStorage } from '../../../../../src/utils/account/accountStorage'
import { loadIdentity } from '../../../../../src/utils/account/loadAccount'
import * as accountData from '../../../data/accountData'
import { resetStorage } from '../../../prepare'

describe('loadIdentity', () => {
  beforeEach(async () => {
    await setAccount(defaultAccount, true)
  })
  afterEach(() => {
    resetStorage()
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
