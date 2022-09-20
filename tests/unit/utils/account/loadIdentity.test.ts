import { deepStrictEqual } from 'assert'
import { defaultAccount, setAccount } from '../../../../src/utils/account'
import { loadIdentity } from '../../../../src/utils/account/loadAccount'
import { storeIdentity } from '../../../../src/utils/account/storeAccount'
import * as accountData from '../../data/accountData'
import { resetFakeFiles } from '../../prepare'

const password = 'supersecret'

describe('loadIdentity', () => {
  beforeEach(async () => {
    await setAccount(defaultAccount)
  })
  afterEach(() => {
    resetFakeFiles()
    jest.clearAllMocks()
  })

  it('loads identity', async () => {
    await storeIdentity(accountData.account1, password)
    const identity = await loadIdentity(password)
    deepStrictEqual(identity, {
      publicKey: accountData.account1.publicKey,
      privKey: accountData.account1.privKey,
      mnemonic: accountData.account1.mnemonic,
      pgp: accountData.account1.pgp,
    })
  })
})
