import { deepStrictEqual } from 'assert'
import { defaultAccount, setAccount, storeContracts } from '..'
import { contractStorage } from '../contractStorage'
import { loadContract } from '.'
import * as accountData from '../../../../tests/unit/data/accountData'

describe('loadContract', () => {
  beforeEach(async () => {
    await setAccount(defaultAccount)
  })
  it('loads contracts', async () => {
    await storeContracts(accountData.account1.contracts)

    const contract = accountData.account1.contracts[0]
    const loadedContract = await loadContract(contract.id)
    expect(contractStorage.getMap).toHaveBeenCalledWith(contract.id)
    deepStrictEqual(loadedContract, accountData.account1.contracts[0])
  })
})
