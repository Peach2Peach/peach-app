import { deepStrictEqual, ok } from 'assert'
import { recoverAccount, setAccount } from '../../../../src/utils/account'
import * as accountData from '../../data/accountData'
import { resetFakeFiles } from '../../prepare'

describe('recoverAccount', () => {
  beforeAll(async () => {
    await setAccount(accountData.account1)
  })
  afterEach(() => {
    resetFakeFiles()
    jest.clearAllMocks()
  })

  it('would decrypt recovery account', async () => {
    const [recoveredAccount, err] = await recoverAccount({
      encryptedAccount: JSON.stringify(accountData.recoveredAccount),
      password: 'mockpassword',
    })
    ok(!err, 'Error has been thrown ' + err)
    deepStrictEqual(recoveredAccount, accountData.recoveredAccount)
  })
})
