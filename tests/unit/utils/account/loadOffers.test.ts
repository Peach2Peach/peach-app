import { deepStrictEqual } from 'assert'
import { defaultAccount, setAccount } from '../../../../src/utils/account'
import * as file from '../../../../src/utils/file'
import { loadOffers } from '../../../../src/utils/account/loadAccount'
import { storeOffers } from '../../../../src/utils/account/storeAccount'
import * as accountData from '../../data/accountData'
import { fakeFiles, resetFakeFiles } from '../../prepare'

const password = 'supersecret'

describe('loadOffers', () => {
  beforeEach(async () => {
    const mock = jest.spyOn(file, 'readDir')
    mock.mockImplementation(async () => ['/peach-account-offers/37.json', '/peach-account-offers/38.json'])

    await setAccount(defaultAccount)
  })
  afterEach(() => {
    resetFakeFiles()
    jest.clearAllMocks()
  })

  it('loads offers for version 0.1.4', async () => {
    await storeOffers(accountData.account1.offers, password)
    const offers = await loadOffers(password, '0.1.4')
    deepStrictEqual(offers, accountData.account1.offers)
  })
  it('loads offers for version 0.1.3', async () => {
    fakeFiles['/peach-account-offers.json'] = JSON.stringify(accountData.account1.offers)
    const offers = await loadOffers(password, '0.1.3')
    deepStrictEqual(offers, accountData.account1.offers)
  })
})
