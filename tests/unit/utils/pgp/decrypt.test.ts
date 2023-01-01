import OpenPGP from 'react-native-fast-openpgp'
import { account, defaultAccount, setAccount } from '../../../../src/utils/account'
import { decrypt } from '../../../../src/utils/pgp/decrypt'
import { resetStorage } from '../../prepare'

jest.mock('react-native-fast-openpgp', () => ({
  decrypt: jest.fn(),
}))

describe('decrypt', () => {
  beforeEach(async () => {
    resetStorage()
    await setAccount({
      ...defaultAccount,
      pgp: {
        publicKey: 'publicKey',
        privateKey: 'privateKey',
      },
    })
  })
  afterEach(() => {
    jest.resetAllMocks()
  })

  it('calls OpenPGP.decrypt with account private key', async () => {
    await decrypt('encrypted')
    expect(OpenPGP.decrypt).toHaveBeenCalledWith('encrypted', account.pgp.privateKey, '')
  })
})
