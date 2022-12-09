import { deepStrictEqual } from 'assert'
import { defaultAccount, loadAccount, setAccount, storeAccount } from '../../../../../src/utils/account'
import * as accountData from '../../../data/accountData'
import { resetStorage } from '../../../prepare'

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
