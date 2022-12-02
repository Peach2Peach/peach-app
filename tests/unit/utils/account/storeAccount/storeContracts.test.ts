import { defaultAccount, setAccount } from '../../../../../src/utils/account'
import { storeContracts } from '../../../../../src/utils/account/storeAccount'
import * as file from '../../../../../src/utils/file'
import * as accountData from '../../../data/accountData'
import * as contractData from '../../../data/contractData'
import { resetFakeFiles } from '../../../prepare'

const password = 'supersecret'

jest.mock('../../../../../src/utils/file', () => ({
  __esModule: true,
  ...jest.requireActual('../../../../../src/utils/file'),
}))

describe('storeContracts', () => {
  let writeFileSpy: jest.SpyInstance

  beforeEach(async () => {
    writeFileSpy = jest.spyOn(file, 'writeFile')

    await setAccount(defaultAccount)
    await storeContracts(defaultAccount.contracts, password)
  })
  afterEach(() => {
    resetFakeFiles()
    writeFileSpy.mockClear()
  })

  it('would write file to store contracts', async () => {
    await storeContracts(accountData.account1.contracts, password)
    expect(writeFileSpy).toHaveBeenCalledWith(
      '/peach-account-contracts/14-15.json',
      JSON.stringify(contractData.contract),
      password,
    )
  })
})
