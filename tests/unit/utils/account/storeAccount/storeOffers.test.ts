import { defaultAccount, setAccount } from '../../../../../src/utils/account'
import { storeOffers } from '../../../../../src/utils/account/storeAccount'
import * as file from '../../../../../src/utils/file'
import * as accountData from '../../../data/accountData'
import * as offerData from '../../../data/offerData'
import { resetFakeFiles } from '../../../prepare'

const password = 'supersecret'

jest.mock('../../../../../src/utils/file', () => ({
  __esModule: true,
  ...jest.requireActual('../../../../../src/utils/file'),
}))

describe('storeOffers', () => {
  let writeFileSpy: jest.SpyInstance

  beforeEach(async () => {
    writeFileSpy = jest.spyOn(file, 'writeFile')
    await setAccount(defaultAccount)
    await storeOffers(defaultAccount.offers, password)
  })
  afterEach(() => {
    resetFakeFiles()
    writeFileSpy.mockClear()
  })

  it('would write file to store offers', async () => {
    await storeOffers(accountData.account1.offers, password)
    expect(writeFileSpy).toHaveBeenCalledWith(
      '/peach-account-offers/37.json',
      JSON.stringify(offerData.buyOffer),
      password,
    )
    expect(writeFileSpy).toHaveBeenCalledWith(
      '/peach-account-offers/38.json',
      JSON.stringify(offerData.sellOffer),
      password,
    )
  })
})
