import { defaultAccount, setAccount } from '../../../../../src/utils/account'
import { offerStorage } from '../../../../../src/utils/account/offerStorage'
import { storeOffers } from '../../../../../src/utils/account/storeAccount'
import * as accountData from '../../../data/accountData'
import * as offerData from '../../../data/offerData'
import { resetStorage } from '../../../prepare'

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
