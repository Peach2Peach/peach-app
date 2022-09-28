import { deepStrictEqual, ok } from 'assert'
import { account, defaultAccount, loadAccount, setAccount } from '../../../../src/utils/account'
import { storeAccount } from '../../../../src/utils/account/'
import * as file from '../../../../src/utils/file'
import * as accountData from '../../data/accountData'
import { fakeFiles, resetFakeFiles } from '../../prepare'

const password = 'supersecret'

describe('loadAccount', () => {
  beforeEach(async () => {
    const existsMock = jest.spyOn(file, 'exists')
    const readDirMock = jest.spyOn(file, 'readDir')
    existsMock.mockImplementation(
      async (path) => path === '/peach-account-contracts' || path === '/peach-account-offers' || !!fakeFiles[path]
    )
    readDirMock.mockImplementation(async (path) =>
      path === '/peach-account-contracts'
        ? ['/peach-account-contracts/14-15.json']
        : ['/peach-account-offers/37.json', '/peach-account-offers/38.json']
    )

    await setAccount(defaultAccount, true)
  })
  afterEach(() => {
    resetFakeFiles()
    jest.clearAllMocks()
  })

  it('returns already loaded account', async () => {
    await setAccount(accountData.account1)
    const acc = await loadAccount(password)
    deepStrictEqual(account, acc)
    deepStrictEqual(account, accountData.account1)
  })
  it('loads account from file', async () => {
    const existsSpy = jest.spyOn(file, 'exists')
    const readFileSpy = jest.spyOn(file, 'readFile')

    await storeAccount(accountData.userWithNoTrades, password)

    const acc = await loadAccount(password)
    expect(existsSpy).toHaveBeenCalledWith('/peach-account-contracts')
    expect(readFileSpy).toHaveBeenCalledTimes(8)
    expect(readFileSpy).toHaveBeenCalledWith(expect.stringContaining('.json'), password)
    ok(acc.publicKey)
    ok(account.publicKey)
    deepStrictEqual(account, acc)
    deepStrictEqual(account, accountData.userWithNoTrades)
  })
})
