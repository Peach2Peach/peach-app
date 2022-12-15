import { deepStrictEqual } from 'assert'
import { defaultAccount, setAccount, storeOffers } from '../../../../../src/utils/account'
import { loadOffers } from '../../../../../src/utils/account/loadAccount'
import * as accountData from '../../../data/accountData'
import { resetStorage } from '../../../prepare'

describe('loadOffers', () => {
  beforeEach(async () => {
    await setAccount(defaultAccount, true)
  })
  afterEach(() => {
    resetStorage()
  })

  it('loads offers', async () => {
    await storeOffers(accountData.account1.offers)

    const offers = await loadOffers()
    deepStrictEqual(offers, accountData.account1.offers)
  })
})
