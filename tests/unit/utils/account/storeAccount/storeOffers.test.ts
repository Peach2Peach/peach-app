import { defaultAccount, setAccount } from '../../../../../src/utils/account'
import { storeOffers } from '../../../../../src/utils/account/storeAccount'
import * as fileUtils from '../../../../../src/utils/file'
import * as accountData from '../../../data/accountData'
import { resetFakeFiles } from '../../../prepare'

const password = 'supersecret'

describe('storeOffers', () => {
  beforeEach(async () => {
    await setAccount(defaultAccount)
    await storeOffers(defaultAccount.offers, password)
  })
  afterEach(() => {
    resetFakeFiles()
    jest.clearAllMocks()
  })

  it('would write file to store offers', async () => {
    const writeFileSpy = jest.spyOn(fileUtils, 'writeFile')
    await storeOffers(accountData.account1.offers, password)
    expect(writeFileSpy).toHaveBeenCalledWith(
      '/peach-account-offers/37.json',
      JSON.stringify(accountData.buyOffer),
      password,
    )
    expect(writeFileSpy).toHaveBeenCalledWith(
      '/peach-account-offers/38.json',
      JSON.stringify(accountData.sellOffer),
      password,
    )
  })
})
