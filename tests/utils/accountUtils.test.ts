import { deepStrictEqual, ok } from 'assert'
import { Account, createAccount, getAccount } from '../../src/utils/accountUtils'
import CryptoJS from 'react-native-crypto-js'

jest.mock('../../src/utils/peachApi.ts')

const recoveredAccount: Account = {
  publicKey: 'Recovered Account',
  settings: {}
}

const password = 'supersecret'

describe('createAccount', () => {
  const onSuccess = jest.fn()
  const onError = jest.fn()

  it('creates a new account and stores it encrypted', async () => {
    const result = await createAccount({
      acc: null,
      password,
      onSuccess,
      onError
    })
    const account = CryptoJS.AES.decrypt(result, password).toString(CryptoJS.enc.Utf8)

    ok(JSON.parse(account).publicKey)
    expect(onSuccess).toHaveBeenCalled()
  })

  it('recovers account and stores it encrypted', async () => {
    const result = await createAccount({ acc: recoveredAccount, password, onSuccess, onError })
    const account = CryptoJS.AES.decrypt(result, password).toString(CryptoJS.enc.Utf8)

    deepStrictEqual(recoveredAccount, JSON.parse(account))
    expect(onSuccess).toHaveBeenCalled()
  })
})

describe('getAccount', () => {
  const onSuccess = jest.fn()
  const onError = jest.fn()

  it('decrypts account from storage', async () => {
    await createAccount({ acc: null, password, onSuccess, onError })
    const account = await getAccount(password)
    ok(account.publicKey)
    expect(onSuccess).toHaveBeenCalled()
    expect(onError).toHaveBeenCalledTimes(0)
  })
})


