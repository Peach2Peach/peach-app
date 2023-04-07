import { deepStrictEqual, ok } from 'assert'
import { decryptAccount, setAccount } from '.'
import * as accountData from '../../../tests/unit/data/accountData'
import { resetStorage } from '../../../tests/unit/prepare'
import CryptoJS from 'react-native-crypto-js'

describe('decryptAccount', () => {
  beforeAll(async () => {
    await setAccount(accountData.account1)
  })
  afterEach(() => {
    resetStorage()
  })

  it('would decrypt recovery account', async () => {
    CryptoJS.AES.decrypt = jest.fn().mockImplementationOnce((data) => data)
    const [recoveredAccount, err] = await decryptAccount({
      encryptedAccount: JSON.stringify(accountData.recoveredAccount),
      password: 'mockpassword',
    })
    ok(!err, 'Error has been thrown ' + err)
    deepStrictEqual(recoveredAccount, accountData.recoveredAccount)
  })
})
