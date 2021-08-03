import { ok } from 'assert'
import { createAccount, getAccount } from '../../src/utils/accountUtils'


describe('createAccount', () => {
  it('creates a new account', async () => {
    const result = await createAccount()
    const account = await getAccount()
    ok(account.id)
  })
})