import { deepStrictEqual } from 'assert'
import { defaultAccount, setAccount, storeContracts } from '../../../../../src/utils/account'
import { contractStorage } from '../../../../../src/utils/account/contractStorage'
import { loadContract } from '../../../../../src/utils/account/loadAccount'
import * as accountData from '../../../data/accountData'
import { resetStorage } from '../../../prepare'

describe('loadContract', () => {
  beforeEach(async () => {
    await setAccount(defaultAccount, true)
  })
  afterEach(() => {
    resetStorage()
  })

  it('loads contracts', async () => {
    await storeContracts(accountData.account1.contracts)

    const contract = accountData.account1.contracts[0]
    const loadedContract = await loadContract(contract.id)
    expect(contractStorage.getMap).toHaveBeenCalledWith(contract.id)
    deepStrictEqual(loadedContract, accountData.account1.contracts[0])
  })
})
