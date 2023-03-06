import { defaultAccount, setAccount } from '../../../../../src/utils/account'
import { contractStorage } from '../../../../../src/utils/account/contractStorage'
import { storeContracts } from '../../../../../src/utils/account/storeAccount'
import * as accountData from '../../../data/accountData'
import * as contractData from '../../../data/contractData'
import { resetStorage } from '../../../prepare'

describe('storeContracts', () => {
  beforeEach(async () => {
    await setAccount(defaultAccount)
    await storeContracts(defaultAccount.contracts)
  })
  afterEach(() => {
    resetStorage()
  })

  it('would store contracts', async () => {
    await storeContracts(accountData.account1.contracts)
    expect(contractStorage.setMapAsync).toHaveBeenCalledWith('14-15', contractData.contract)
  })
})
