import { deepStrictEqual, ok } from 'assert'
import { createAccount, getAccount } from '../../src/utils/accountUtils'
import CryptoJS, { AES } from 'react-native-crypto-js'

const recoveredAccount = {
  id: 'Recovered Account'
}

const password = 'supersecret'

describe('createAccount', () => {
  it('creates a new account and stores it encrypted', async () => {
    const result = await createAccount()
    const account = AES.decrypt(result, '').toString(CryptoJS.enc.Utf8)

    ok(JSON.parse(account).id)
  })

  it('creates a new account and stores it encrypted with password', async () => {
    const result = await createAccount(null, password)
    const account = AES.decrypt(result, password).toString(CryptoJS.enc.Utf8)

    ok(JSON.parse(account).id)
  })

  it('recovers account and stores it encrypted', async () => {
    const result = await createAccount(recoveredAccount)
    const account = AES.decrypt(result, '').toString(CryptoJS.enc.Utf8)

    deepStrictEqual(recoveredAccount, JSON.parse(account))
  })

  it('recovers account and stores it encrypted with password', async () => {
    const result = await createAccount(recoveredAccount, password)
    const account = AES.decrypt(result, password).toString(CryptoJS.enc.Utf8)

    deepStrictEqual(recoveredAccount, JSON.parse(account))
  })

  it('should handle faulty parameters', async () => {
    const result = await createAccount('')
    console.log(result)
  })
})

describe('getAccount', () => {
  it('decrypts account from storage', async () => {
    await createAccount()
    const account = await getAccount()
    ok(account.id)
  })
})


