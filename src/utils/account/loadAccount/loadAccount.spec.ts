import { deepStrictEqual, ok } from 'assert'
import { account, defaultAccount, loadAccount, setAccount, storeAccount } from '..'
import { account1, buyer } from '../../../../tests/unit/data/accountData'

describe('loadAccount', () => {
  beforeEach(async () => {
    await setAccount(defaultAccount)
  })

  it('loads account', async () => {
    await storeAccount(buyer)

    const acc = await loadAccount()
    ok(acc.publicKey)
    ok(account.publicKey)
    deepStrictEqual(account, acc)
    deepStrictEqual(account, buyer)
  })

  it('returns already loaded account', async () => {
    await setAccount(account1)
    const acc = await loadAccount()
    deepStrictEqual(account, acc)
    deepStrictEqual(account, account1)
  })
})
