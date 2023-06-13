import { deepStrictEqual } from 'assert'
import { defaultAccount, setAccount, storeOffers } from '..'
import { offerStorage } from '../offerStorage'
import { loadOffer } from '.'
import * as accountData from '../../../../tests/unit/data/accountData'

describe('loadOffer', () => {
  beforeEach(() => {
    setAccount(defaultAccount)
  })

  it('loads offer', async () => {
    await storeOffers(accountData.buyer.offers)

    const buyOffer = accountData.buyer.offers[0]
    const loadedOffer = await loadOffer(buyOffer.id)
    expect(offerStorage.getMap).toHaveBeenCalledWith(buyOffer.id)
    deepStrictEqual(loadedOffer, accountData.buyer.offers[0])
  })
})
