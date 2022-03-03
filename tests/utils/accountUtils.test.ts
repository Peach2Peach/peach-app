import { deepStrictEqual, ok } from 'assert'
import { account, createAccount, defaultAccount, loadAccount, setAccount } from '../../src/utils/accountUtils'
import * as accountData from '../data/accountData'
import CryptoJS from 'react-native-crypto-js'
import { userAuth } from '../../src/utils/peachAPI'

jest.mock('../../src/utils/peachAPI', () => {
  const mockedModule = jest.requireActual(
    '../../src/utils/__mocks__/peachAPI'
  )
  return {
    ...mockedModule,
  }
})

const password = 'supersecret'

describe('createAccount', () => {
  const onSuccess = jest.fn()
  const onError = jest.fn()

  beforeEach(async () => {
    await setAccount(defaultAccount)
  })

  it('creates a new account and stores it encrypted', async () => {
    await createAccount({
      password,
      onSuccess,
      onError
    })

    ok(account.publicKey)
    expect(onSuccess).toHaveBeenCalled()
  })
})

describe('setAccount', () => {
  it('sets an account', async () => {
    await setAccount(accountData.account1)
    expect(userAuth).toBeCalled()
  })
})

describe('loadAccount', () => {
  const onSuccess = jest.fn()
  const onError = jest.fn()

  it('decrypts account from storage', async () => {
    await createAccount({ password, onSuccess, onError })
    const acc = await loadAccount(password)
    ok(acc.publicKey)
    expect(onSuccess).toHaveBeenCalled()
    expect(onError).toHaveBeenCalledTimes(0)
  })
})
