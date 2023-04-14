import { defaultAccount, setAccount } from '..'
import { contractStorage } from '../contractStorage'
import { storeContract } from '.'
import * as accountData from '../../../../tests/unit/data/accountData'
import * as contractData from '../../../../tests/unit/data/contractData'

describe('storeContract', () => {
  beforeEach(async () => {
    await setAccount(defaultAccount)
  })

  it('would store contracts', async () => {
    await storeContract(accountData.account1.contracts[0])
    expect(contractStorage.setMap).toHaveBeenCalledWith('14-15', contractData.contract)
  })
})
