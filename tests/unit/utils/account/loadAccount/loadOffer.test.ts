import { deepStrictEqual } from 'assert'
import { defaultAccount, setAccount, storeOffers } from '../../../../../src/utils/account'
import { offerStorage } from '../../../../../src/utils/account/offerStorage'
import { loadOffer } from '../../../../../src/utils/account/loadAccount'
import * as accountData from '../../../data/accountData'
import { resetStorage } from '../../../prepare'

describe('loadOffer', () => {
  beforeEach(async () => {
    await setAccount(defaultAccount, true)
  })
  afterEach(() => {
    resetStorage()
  })

  it('loads offer', async () => {
    await storeOffers(accountData.buyer.offers)

    const buyOffer = accountData.buyer.offers[0]
    const loadedOffer = await loadOffer(buyOffer.id!)
    expect(offerStorage.getMap).toHaveBeenCalledWith(buyOffer.id)
    deepStrictEqual(loadedOffer, accountData.buyer.offers[0])
  })
})
