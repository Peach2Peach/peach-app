import OpenPGP from 'react-native-fast-openpgp'
import { defaultAccount, setAccount } from '../account'
import { decryptSymmetric } from '.'

describe('decrypt', () => {
  beforeEach(async () => {
    await setAccount({
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
