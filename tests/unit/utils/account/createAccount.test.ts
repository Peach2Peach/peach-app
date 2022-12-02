import { notStrictEqual, ok, strictEqual } from 'assert'
import { account, createAccount, defaultAccount, setAccount } from '../../../../src/utils/account'
import { getSession } from '../../../../src/utils/session'
import { resetFakeFiles } from '../../prepare'

const password = 'supersecret'

describe('createAccount', () => {
  beforeEach(async () => {
    await setAccount(defaultAccount)
  })
  afterEach(() => {
    resetFakeFiles()
    jest.clearAllMocks()
  })

  it('creates a new account each time', async () => {
    ok(await createAccount(password))
    const firstPublicKey = JSON.parse(JSON.stringify(account.publicKey))

    ok(account.publicKey)
    ok(account.privKey)
    ok(account.mnemonic)
    strictEqual(getSession().password, password)

    ok(await createAccount(password))

    notStrictEqual(firstPublicKey, account.publicKey)
  })
})
