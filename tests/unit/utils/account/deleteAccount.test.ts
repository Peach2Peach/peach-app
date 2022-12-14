import { ok } from 'assert'
import { deleteAccount, setAccount } from '../../../../src/utils/account'
import * as accountData from '../../data/accountData'
import { resetStorage } from '../../prepare'

describe('deleteAccount', () => {
  beforeAll(async () => {
    await setAccount(accountData.account1)
  })
  afterEach(() => {
    resetStorage()
  })

  it('would delete account file', async () => {
    await deleteAccount()
    ok(true)
  })
})
