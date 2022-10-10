import { defaultAccount, setAccount } from '../../../../../src/utils/account'
import { storeContracts } from '../../../../../src/utils/account/storeAccount'
import * as fileUtils from '../../../../../src/utils/file'
import * as accountData from '../../../data/accountData'
import { resetFakeFiles } from '../../../prepare'

const password = 'supersecret'

describe('storeContracts', () => {
  beforeEach(async () => {
    await setAccount(defaultAccount)
    await storeContracts(defaultAccount.contracts, password)
  })
  afterEach(() => {
    resetFakeFiles()
    jest.clearAllMocks()
  })

  it('would write file to store contracts', async () => {
    const writeFileSpy = jest.spyOn(fileUtils, 'writeFile')
    await storeContracts(accountData.account1.contracts, password)
    expect(writeFileSpy).toHaveBeenCalledWith(
      '/peach-account-contracts/14-15.json',
      JSON.stringify(accountData.contract),
      password,
    )
  })
})
