import { notStrictEqual, ok } from 'assert'
import { account, createAccount, defaultAccount, setAccount } from '../../../../src/utils/account'
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
    ok(await createAccount())
    const firstPublicKey = JSON.parse(JSON.stringify(account.publicKey))

    ok(account.publicKey)
    ok(account.privKey)
    ok(account.mnemonic)

    ok(await createAccount())

    notStrictEqual(firstPublicKey, account.publicKey)
  })
})
