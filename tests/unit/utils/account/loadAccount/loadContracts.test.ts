import { deepStrictEqual } from 'assert'
import { defaultAccount, setAccount, storeAccount } from '../../../../../src/utils/account'
import { loadContracts } from '../../../../../src/utils/account/loadAccount'
import { getRandom } from '../../../../../src/utils/crypto'
import * as accountData from '../../../data/accountData'
import { resetStorage } from '../../../prepare'

jest.mock('../../../../../src/utils/crypto', () => ({
  __esModule: true,
  getRandom: jest.fn(),
}))

describe('loadContracts', () => {
  beforeEach(async () => {
    ;(<jest.Mock>getRandom).mockImplementation(async () => Buffer.from('0000000000000000'))

    await setAccount(defaultAccount, true)
  })
  afterEach(() => {
    resetStorage()
  })

  it('loads contracts', async () => {
    await storeAccount(accountData.account1)

    const contracts = await loadContracts()
    deepStrictEqual(contracts, accountData.account1.contracts)
  })
})
