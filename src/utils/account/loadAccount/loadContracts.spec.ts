import { deepStrictEqual } from 'assert'
import { defaultAccount, setAccount, storeAccount } from '..'
import { loadContracts } from '.'
import { getRandom } from '../../crypto'
import * as accountData from '../../../../tests/unit/data/accountData'
import { resetStorage } from '../../../../tests/unit/prepare'

jest.mock('../../crypto', () => ({
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
