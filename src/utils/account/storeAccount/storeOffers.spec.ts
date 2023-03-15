import { defaultAccount, setAccount } from '..'
import { offerStorage } from '../offerStorage'
import { storeOffers } from '.'
import * as accountData from '../../../../tests/unit/data/accountData'
import * as offerData from '../../../../tests/unit/data/offerData'
import { resetStorage } from '../../../../tests/unit/prepare'

describe('storeOffers', () => {
  beforeEach(async () => {
    await setAccount(defaultAccount)
    await storeOffers(defaultAccount.offers)
  })
  afterEach(() => {
    resetStorage()
  })

  it('would write file to store offers', async () => {
    await storeOffers(accountData.account1.offers)
    expect(offerStorage.setMapAsync).toHaveBeenCalledWith('37', offerData.buyOffer)
    expect(offerStorage.setMapAsync).toHaveBeenCalledWith('38', offerData.sellOffer)
  })
})
