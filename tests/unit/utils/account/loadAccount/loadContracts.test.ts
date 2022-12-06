import { deepStrictEqual } from 'assert'
import { defaultAccount, setAccount, storeAccount } from '../../../../../src/utils/account'
import { loadContracts } from '../../../../../src/utils/account/loadAccount'
import { getRandom } from '../../../../../src/utils/crypto'
import * as file from '../../../../../src/utils/file'
import { exists, readDir } from '../../../../../src/utils/file'
import * as accountData from '../../../data/accountData'
import { fakeFiles, resetFakeFiles, resetMocks } from '../../../prepare'

jest.mock('../../../../../src/utils/crypto', () => ({
  __esModule: true,
  getRandom: jest.fn(),
}))
jest.mock('../../../../../src/utils/file', () => ({
  __esModule: true,
  ...jest.requireActual('../../../../../src/utils/file'),
  exists: jest.fn(),
  readDir: jest.fn(),
}))
const password = 'supersecret'

describe('loadContracts', () => {
  let readFileSpy: jest.SpyInstance

  beforeEach(async () => {
    readFileSpy = jest.spyOn(file, 'readFile')
    ;(<jest.Mock>getRandom).mockImplementation(async () => Buffer.from('0000000000000000'))

    await setAccount(defaultAccount, true)
  })
  afterEach(() => {
    resetFakeFiles()
    resetMocks(exists, readDir)
    readFileSpy.mockClear()
  })

  it('loads contracts from files', async () => {
    ;(<jest.Mock>exists).mockImplementation(async (path) => path === '/peach-account-contracts' || !!fakeFiles[path])
    ;(<jest.Mock>readDir).mockImplementation(async (path) =>
      path === '/peach-account-contracts' ? ['/peach-account-contracts/14-15.json'] : [],
    )

    await storeAccount(accountData.account1, password)

    const contracts = await loadContracts(password)
    expect(exists).toHaveBeenCalledWith('/peach-account-contracts')
    expect(readFileSpy).toHaveBeenCalledTimes(1)
    expect(readFileSpy).toHaveBeenCalledWith('/peach-account-contracts/14-15.json', password)
    deepStrictEqual(contracts, accountData.account1.contracts)
  })
  it('loads contracts for version 0.1.3', async () => {
    ;(<jest.Mock>exists).mockImplementation(async (path) => path === '/peach-account-contracts.json')

    fakeFiles['/peach-account-contracts.json'] = JSON.stringify(accountData.account1.contracts)
    const contracts = await loadContracts(password)
    deepStrictEqual(contracts, accountData.account1.contracts)
  })
})
