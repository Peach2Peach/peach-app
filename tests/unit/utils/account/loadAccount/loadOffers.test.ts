import { deepStrictEqual } from 'assert'
import { defaultAccount, setAccount, storeAccount } from '../../../../../src/utils/account'
import { loadOffers } from '../../../../../src/utils/account/loadAccount'
import * as file from '../../../../../src/utils/file'
import * as accountData from '../../../data/accountData'
import { fakeFiles, resetFakeFiles } from '../../../prepare'

const password = 'supersecret'

describe('loadOffers', () => {
  beforeEach(async () => {
    const existsMock = jest.spyOn(file, 'exists')
    const readDirMock = jest.spyOn(file, 'readDir')
    existsMock.mockImplementation(async (path) => path === '/peach-account-offers' || !!fakeFiles[path])
    readDirMock.mockImplementation(async (path) =>
      path === '/peach-account-offers' ? ['/peach-account-offers/37.json', '/peach-account-offers/38.json'] : [],
    )

    await setAccount(defaultAccount, true)
  })
  afterEach(() => {
    resetFakeFiles()
    jest.clearAllMocks()
  })

  it('loads offers from files', async () => {
    const existsSpy = jest.spyOn(file, 'exists')
    const readFileSpy = jest.spyOn(file, 'readFile')

    await storeAccount(accountData.account1, password)

    const offers = await loadOffers(password)
    expect(existsSpy).toHaveBeenCalledWith('/peach-account-offers')
    expect(readFileSpy).toHaveBeenCalledTimes(2)
    expect(readFileSpy).toHaveBeenCalledWith('/peach-account-offers/37.json', password)
    expect(readFileSpy).toHaveBeenCalledWith('/peach-account-offers/38.json', password)
    deepStrictEqual(offers, accountData.account1.offers)
  })
})
