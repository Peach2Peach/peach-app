import { deepStrictEqual } from 'assert'
import { defaultAccount, setAccount, storeAccount } from '../../../../../src/utils/account'
import { loadIdentity } from '../../../../../src/utils/account/loadAccount'
import * as file from '../../../../../src/utils/file'
import * as accountData from '../../../data/accountData'
import { resetFakeFiles } from '../../../prepare'

const password = 'supersecret'

describe('loadIdentity', () => {
  beforeEach(async () => {
    await setAccount(defaultAccount, true)
  })
  afterEach(() => {
    resetFakeFiles()
    jest.clearAllMocks()
  })

  it('loads identity from file', async () => {
    const readFileSpy = jest.spyOn(file, 'readFile')

    await storeAccount(accountData.account1, password)

    const identity = await loadIdentity(password)
    expect(readFileSpy).toHaveBeenCalledWith('/peach-account-identity.json', password)
    deepStrictEqual(identity, {
      publicKey: accountData.account1.publicKey,
      privKey: accountData.account1.privKey,
      mnemonic: accountData.account1.mnemonic,
      pgp: accountData.account1.pgp,
    })
  })
})
