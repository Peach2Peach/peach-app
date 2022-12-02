import { defaultAccount, setAccount } from '../../../../../src/utils/account'
import { storeIdentity } from '../../../../../src/utils/account/storeAccount'
import * as fileUtils from '../../../../../src/utils/file'
import * as accountData from '../../../data/accountData'
import { resetFakeFiles } from '../../../prepare'

const password = 'supersecret'

jest.mock('../../../../../src/utils/file', () => ({
  __esModule: true,
  ...jest.requireActual('../../../../../src/utils/file'),
}))

describe('storeIdentity', () => {
  let writeFileSpy: jest.SpyInstance

  beforeEach(async () => {
    writeFileSpy = jest.spyOn(fileUtils, 'writeFile')
    await setAccount(defaultAccount)
  })
  afterEach(() => {
    resetFakeFiles()
    writeFileSpy.mockClear()
  })

  it('would write file to store identity', async () => {
    await storeIdentity(accountData.account1, password)
    expect(writeFileSpy).toHaveBeenCalledWith(
      '/peach-account-identity.json',
      JSON.stringify({
        publicKey: accountData.account1.publicKey,
        privKey: accountData.account1.privKey,
        mnemonic: accountData.account1.mnemonic,
        pgp: accountData.account1.pgp,
      }),
      password,
    )
  })
})
