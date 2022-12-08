import { deepStrictEqual, ok } from 'assert'
import { decryptAccount, setAccount } from '../../../../src/utils/account'
import * as accountData from '../../data/accountData'
import { resetFakeFiles } from '../../prepare'

describe('decryptAccount', () => {
  beforeAll(async () => {
    await setAccount(accountData.account1)
  })
  afterEach(() => {
    resetFakeFiles()
  })

  it('would decrypt recovery account', async () => {
    const [recoveredAccount, err] = await decryptAccount({
      encryptedAccount: JSON.stringify(accountData.recoveredAccount),
      password: 'mockpassword',
    })
    ok(!err, 'Error has been thrown ' + err)
    deepStrictEqual(recoveredAccount, accountData.recoveredAccount)
  })
})
