import { deepStrictEqual } from 'assert'
import { defaultAccount, loadAccount, setAccount, storeAccount } from '..'
import * as accountData from '../../../../tests/unit/data/accountData'
import { resetStorage } from '../../../../tests/unit/prepare'

describe('storeAccount', () => {
  beforeEach(async () => {
    await setAccount(defaultAccount)
  })
  afterEach(() => {
    resetStorage()
  })

  it('would store whole account', async () => {
    await storeAccount(accountData.buyer)
    deepStrictEqual(await loadAccount(), accountData.buyer)
  })
})
