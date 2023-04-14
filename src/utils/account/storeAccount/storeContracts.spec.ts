import { defaultAccount, setAccount } from '..'
import { contractStorage } from '../contractStorage'
import { storeContracts } from '.'
import * as accountData from '../../../../tests/unit/data/accountData'
import * as contractData from '../../../../tests/unit/data/contractData'

describe('storeContracts', () => {
  beforeEach(async () => {
    await setAccount(defaultAccount)
    await storeContracts(defaultAccount.contracts)
  })

  it('would store contracts', async () => {
    await storeContracts(accountData.account1.contracts)
    expect(contractStorage.setMapAsync).toHaveBeenCalledWith('14-15', contractData.contract)
  })
})
