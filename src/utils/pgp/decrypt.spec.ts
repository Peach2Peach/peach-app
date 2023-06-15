import OpenPGP from 'react-native-fast-openpgp'
import { account, defaultAccount, setAccount } from '../account'
import { decrypt } from './decrypt'

describe('decrypt', () => {
  beforeEach(() => {
    setAccount({
      ...defaultAccount,
      pgp: {
        publicKey: 'publicKey',
        privateKey: 'privateKey',
      },
    })
  })
  it('calls OpenPGP.decrypt with account private key', async () => {
    await decrypt('encrypted')
    expect(OpenPGP.decrypt).toHaveBeenCalledWith('encrypted', account.pgp.privateKey, '')
  })
})
