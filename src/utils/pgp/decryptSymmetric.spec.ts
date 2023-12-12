import OpenPGP from 'react-native-fast-openpgp'
import { defaultAccount, setAccount } from '../account/account'
import { decryptSymmetric } from './decryptSymmetric'

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
    await decryptSymmetric('encrypted', 'passhphrase')
    expect(OpenPGP.decryptSymmetric).toHaveBeenCalledWith('encrypted', 'passhphrase', { cipher: 2 })
  })
})
