import { notStrictEqual, ok } from 'assert'
import { account, createAccount, defaultAccount, setAccount } from '../../../../src/utils/account'
import { resetStorage } from '../../prepare'

describe('createAccount', () => {
  beforeEach(async () => {
    await setAccount(defaultAccount)
  })
  afterEach(() => {
    resetStorage()
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
