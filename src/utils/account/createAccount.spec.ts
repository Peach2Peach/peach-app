import { notStrictEqual, ok } from 'assert'
import { account, createAccount, defaultAccount, setAccount } from '.'
import { resetStorage } from '../../../tests/unit/prepare'

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
