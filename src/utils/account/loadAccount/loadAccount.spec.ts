import { deepStrictEqual, ok } from 'assert'
import { defaultAccount, loadAccount, setAccount, storeAccount } from '..'
import { account1, buyer } from '../../../../tests/unit/data/accountData'
import { useAccountStore } from '../account'

describe('loadAccount', () => {
  beforeEach(() => {
    setAccount(defaultAccount)
  })

  it('loads account', async () => {
    await storeAccount(buyer)

    const acc = await loadAccount()
    ok(acc.publicKey)
    const account = useAccountStore.getState().account
    ok(account.publicKey)
    deepStrictEqual(account, acc)
    deepStrictEqual(account, buyer)
  })

  it('returns already loaded account', async () => {
    setAccount(account1)
    const acc = await loadAccount()
    const account = useAccountStore.getState().account
    deepStrictEqual(account, acc)
    deepStrictEqual(account, account1)
  })
})
