import { deepStrictEqual } from 'assert'
import { defaultAccount, setAccount, storeAccount } from '../../../../../src/utils/account'
import { loadTradingLimit } from '../../../../../src/utils/account/loadAccount'
import * as file from '../../../../../src/utils/file'
import * as accountData from '../../../data/accountData'
import { resetFakeFiles } from '../../../prepare'

const password = 'supersecret'

jest.mock('../../../../../src/utils/file', () => ({
  __esModule: true,
  ...jest.requireActual('../../../../../src/utils/file'),
}))

describe('loadTradingLimit', () => {
  let readFileSpy: jest.SpyInstance

  beforeEach(async () => {
    readFileSpy = jest.spyOn(file, 'readFile')

    await setAccount(defaultAccount, true)
  })
  afterEach(() => {
    resetFakeFiles()
    readFileSpy.mockClear()
  })

  it('loads trading limit from files', async () => {
    await storeAccount(accountData.account1, password)

    const tradingLimit = await loadTradingLimit(password)
    expect(readFileSpy).toHaveBeenCalledWith('/peach-account-tradingLimit.json', password)
    deepStrictEqual(tradingLimit, accountData.account1.tradingLimit)
  })
})
