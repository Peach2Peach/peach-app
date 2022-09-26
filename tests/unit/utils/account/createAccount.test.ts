import { notStrictEqual, ok, strictEqual } from 'assert'
import { account, createAccount, defaultAccount, setAccount } from '../../../../src/utils/account'
import { getSession } from '../../../../src/utils/session'
import { resetFakeFiles } from '../../prepare'

const password = 'supersecret'

describe('createAccount', () => {
  const onSuccess = jest.fn()
  const onError = jest.fn()

  beforeEach(async () => {
    await setAccount(defaultAccount)
  })
  afterEach(() => {
    resetFakeFiles()
    jest.clearAllMocks()
  })

  it('creates a new account each time', async () => {
    await createAccount({
      password,
      onSuccess,
      onError,
    })
    const firstPublicKey = JSON.parse(JSON.stringify(account.publicKey))

    ok(account.publicKey)
    ok(account.privKey)
    ok(account.mnemonic)
    strictEqual(getSession().password, password)
    expect(onSuccess).toHaveBeenCalled()

    await createAccount({
      password,
      onSuccess,
      onError,
    })

    notStrictEqual(firstPublicKey, account.publicKey)
  })
})
