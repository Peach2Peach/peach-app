import { deepStrictEqual } from 'assert'
import { defaultAccount, setAccount, storeAccount } from '../../../../../src/utils/account'
import { loadContracts } from '../../../../../src/utils/account/loadAccount'
import * as file from '../../../../../src/utils/file'
import * as accountData from '../../../data/accountData'
import { fakeFiles, resetFakeFiles } from '../../../prepare'

const password = 'supersecret'

describe('loadContracts', () => {
  beforeEach(async () => {
    const existsMock = jest.spyOn(file, 'exists')
    const readDirMock = jest.spyOn(file, 'readDir')
    existsMock.mockImplementation(async (path) => path === '/peach-account-contracts' || !!fakeFiles[path])
    readDirMock.mockImplementation(async (path) =>
      path === '/peach-account-contracts' ? ['/peach-account-contracts/14-15.json'] : [],
    )

    await setAccount(defaultAccount, true)
  })
  afterEach(() => {
    resetFakeFiles()
    jest.clearAllMocks()
  })

  it('loads contracts from files', async () => {
    const existsSpy = jest.spyOn(file, 'exists')
    const readFileSpy = jest.spyOn(file, 'readFile')

    await storeAccount(accountData.account1, password)

    const contracts = await loadContracts(password)
    expect(existsSpy).toHaveBeenCalledWith('/peach-account-contracts')
    expect(readFileSpy).toHaveBeenCalledTimes(1)
    expect(readFileSpy).toHaveBeenCalledWith('/peach-account-contracts/14-15.json', password)
    deepStrictEqual(contracts, accountData.account1.contracts)
  })
})
