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
    const existsMock = jest.spyOn(file, 'exists')
    const readDirMock = jest.spyOn(file, 'readDir')
    existsMock.mockImplementation(async path => path === '/peach-account-offers' || !!fakeFiles[path])
    readDirMock.mockImplementation(async () => ['/peach-account-offers/37.json', '/peach-account-offers/38.json'])

    await setAccount(defaultAccount)
  })
  afterEach(() => {
    resetFakeFiles()
    jest.clearAllMocks()
  })

  it('loads offers for version 0.1.4', async () => {
    await storeOffers(accountData.account1.offers, password)
    const offers = await loadOffers(password)
    deepStrictEqual(offers, accountData.account1.offers)
  })
  it('loads offers for version 0.1.3', async () => {
    const existsMock = jest.spyOn(file, 'exists')
    existsMock.mockImplementation(async path => path === '/peach-account-offers.json')

    fakeFiles['/peach-account-offers.json'] = JSON.stringify(accountData.account1.offers)
    const offers = await loadOffers(password)
    deepStrictEqual(offers, accountData.account1.offers)
  })
})
