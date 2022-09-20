import { defaultAccount, setAccount } from '../../../../src/utils/account'
import { storeIdentity } from '../../../../src/utils/account/storeAccount'
import * as fileUtils from '../../../../src/utils/file'
import * as accountData from '../../data/accountData'
import { resetFakeFiles } from '../../prepare'

const password = 'supersecret'

describe('storeIdentity', () => {
  beforeEach(async () => {
    await setAccount(defaultAccount)
  })
  afterEach(() => {
    resetFakeFiles()
    jest.clearAllMocks()
  })

  it('would write file to store identity', async () => {
    const writeFileSpy = jest.spyOn(fileUtils, 'writeFile')
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
