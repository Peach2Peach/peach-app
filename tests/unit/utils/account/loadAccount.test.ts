import { deepStrictEqual, ok } from 'assert'
import { account, defaultAccount, loadAccount, setAccount } from '../../../../src/utils/account'
import { storeAccount } from '../../../../src/utils/account/'
import * as fileUtils from '../../../../src/utils/file'
import * as accountData from '../../data/accountData'
import { resetFakeFiles } from '../../prepare'

const password = 'supersecret'

describe('loadAccount', () => {
  beforeEach(async () => {
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
    const existsSpy = jest.spyOn(fileUtils, 'exists')
    const readFileSpy = jest.spyOn(fileUtils, 'readFile')

    await storeAccount(accountData.userWithNoTrades, password)

    const acc = await loadAccount(password)
    expect(existsSpy).toHaveBeenCalledWith('/peach-account-identity.json')
    expect(readFileSpy).toHaveBeenCalledTimes(7)
    expect(readFileSpy).toHaveBeenCalledWith(expect.stringContaining('.json'), password)
    ok(acc.publicKey)
    ok(account.publicKey)
    deepStrictEqual(account, acc)
    deepStrictEqual(account, accountData.userWithNoTrades)
  })
})
