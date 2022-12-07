import { deepStrictEqual, ok } from 'assert'
import { account, defaultAccount, loadAccount, setAccount, storeAccount } from '../../../../../src/utils/account'
import * as accountData from '../../../data/accountData'
import { resetStorage } from '../../../prepare'

describe('loadAccount', () => {
  beforeEach(async () => {
    await setAccount(defaultAccount, true)
  })
  afterEach(() => {
    resetStorage()
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
