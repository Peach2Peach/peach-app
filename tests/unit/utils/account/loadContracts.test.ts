import { deepStrictEqual } from 'assert'
import { defaultAccount, setAccount } from '../../../../src/utils/account'
import * as file from '../../../../src/utils/file'
import { loadContracts } from '../../../../src/utils/account/loadAccount'
import { storeContracts } from '../../../../src/utils/account/storeAccount'
import * as accountData from '../../data/accountData'
import { fakeFiles, resetFakeFiles } from '../../prepare'

const password = 'supersecret'

describe('loadContracts', () => {
  beforeEach(async () => {
    const mock = jest.spyOn(file, 'readDir')
    mock.mockImplementation(async () => ['/peach-account-contracts/14-15.json'])

    await setAccount(defaultAccount)
  })
  afterEach(() => {
    resetFakeFiles()
    jest.clearAllMocks()
  })

  it('loads contracts for version 0.1.4', async () => {
    await storeContracts(accountData.account1.contracts, password)
    const contracts = await loadContracts(password, '0.1.4')
    deepStrictEqual(contracts, accountData.account1.contracts)
  })
  it('loads contracts for version 0.1.3', async () => {
    fakeFiles['/peach-account-contracts.json'] = JSON.stringify(accountData.account1.contracts)
    const contracts = await loadContracts(password, '0.1.3')
    deepStrictEqual(contracts, accountData.account1.contracts)
  })
})
