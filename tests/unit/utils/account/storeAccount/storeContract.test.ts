import { defaultAccount, setAccount } from '../../../../../src/utils/account'
import { contractStorage } from '../../../../../src/utils/account/contractStorage'
import { storeContract } from '../../../../../src/utils/account/storeAccount'
import * as accountData from '../../../data/accountData'
import * as contractData from '../../../data/contractData'
import { resetStorage } from '../../../prepare'

describe('storeContract', () => {
  beforeEach(async () => {
    await setAccount(defaultAccount)
  })
  afterEach(() => {
    resetStorage()
  })

  it('would store contracts', async () => {
    await storeContract(accountData.account1.contracts[0])
    expect(contractStorage.setMap).toHaveBeenCalledWith('14-15', contractData.contract)
  })
})
