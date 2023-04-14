import { deepStrictEqual } from 'assert'
import { defaultAccount, loadAccount, setAccount, storeAccount } from '..'
import * as accountData from '../../../../tests/unit/data/accountData'

describe('storeAccount', () => {
  beforeEach(async () => {
    await setAccount(defaultAccount)
  })

  it('would store whole account', async () => {
    await storeAccount(accountData.buyer)
    deepStrictEqual(await loadAccount(), accountData.buyer)
  })
})
