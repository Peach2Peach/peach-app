import { deepStrictEqual } from 'assert'
import { defaultAccount, setAccount, storeOffers } from '..'
import { loadOffers } from '.'
import * as accountData from '../../../../tests/unit/data/accountData'

describe('loadOffers', () => {
  beforeEach(() => {
    setAccount(defaultAccount)
  })

  it('loads offers', async () => {
    await storeOffers(accountData.account1.offers)

    const offers = await loadOffers()
    deepStrictEqual(offers, accountData.account1.offers)
  })
})
