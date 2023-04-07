import { deepStrictEqual, ok } from 'assert'
import { account, defaultAccount, loadAccount, setAccount, storeAccount } from '..'
import * as accountData from '../../../../tests/unit/data/accountData'

describe('loadAccount', () => {
  beforeEach(async () => {
    await setAccount(defaultAccount, true)
  })

  it('loads account', async () => {
    await storeAccount(accountData.buyer)

    const acc = await loadAccount()
    ok(acc.publicKey)
    ok(account.publicKey)
    deepStrictEqual(account, acc)
    deepStrictEqual(account, accountData.buyer)
  })

  it('returns already loaded account', async () => {
    await setAccount(accountData.account1)
    const acc = await loadAccount()
    deepStrictEqual(account, acc)
    deepStrictEqual(account, accountData.account1)
  })
})
