import { deepStrictEqual, ok } from 'assert'
import CryptoJS from 'react-native-crypto-js'
import { decryptAccount } from '.'
import * as accountData from '../../../tests/unit/data/accountData'

describe('decryptAccount', () => {
  it('would decrypt recovery account', async () => {
    CryptoJS.AES.decrypt = jest.fn().mockImplementationOnce((data) => data)
    const [recoveredAccount, err] = await decryptAccount({
      encryptedAccount: JSON.stringify(accountData.recoveredAccount),
      password: 'mockpassword',
    })
    ok(!err, `Error has been thrown ${err}`)
    deepStrictEqual(recoveredAccount, accountData.recoveredAccount)
  })
})
